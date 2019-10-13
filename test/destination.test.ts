import { Stats } from 'webpack'
import {
  createDestination,
  Destination,
  destinationDefaults,
  Indefinite,
  pickDestination
} from '../src/destination'

const createSource = (options = {}): Indefinite<Partial<Destination>> => ({
  format: _ => _,
  requestOptions: {},
  skip: false,
  stats: {},
  url: 'http://a',
  ...options
})

describe('destinationDefaults', () => {
  it('has a stats object with source set to false', () => {
    expect(destinationDefaults.stats.source).toBe(false)
  })
})

describe('pickDestination', () => {
  it('returns undefined if the source object was not provided', () => {
    expect(pickDestination()).toBeUndefined()
  })

  it('returns undefined if the source object is an empty object', () => {
    const source = {}

    expect(pickDestination(source)).toBeUndefined()
  })

  it('returns undefined if the source object had no destination properties', () => {
    const { format, requestOptions, skip, stats, url, ...rest } = createSource({
      a: 'a',
      b: 'b'
    })

    expect(pickDestination(rest)).toBeUndefined()
  })

  it("returns an object with the source object's format, requestOptions, skip, stats, and url properties", () => {
    const source = createSource()

    const properties = ['format', 'requestOptions', 'skip', 'stats', 'url']

    properties.forEach(property => {
      const item = <Indefinite<Destination>>pickDestination(source)

      expect(item[property]).toBe(source[property])
    })
  })
})

describe('createDestination', () => {
  it('returns undefined if the source object was not provided', () => {
    expect(createDestination()).toBeUndefined()
  })

  it('returns undefined if the source object does not contain a url property', () => {
    const { url, ...restSource } = createSource()

    expect(createDestination(restSource)).toBeUndefined()
  })

  it("returns a destination with the source object's format, requestOptions, skip, and url properties", () => {
    const source = createSource()

    const properties = ['format', 'requestOptions', 'skip', 'url']

    properties.forEach(property => {
      const destination = <Indefinite<Destination>>createDestination(source)

      expect(destination[property]).toBe(source[property])
    })
  })

  it("returns a destination combining the default stats options with the source object's stats options", () => {
    const source = <{ stats: Stats.ToJsonOptionsObject }>createSource({
      stats: {
        assets: false,
        env: false
      }
    })

    const destination = <Destination>createDestination(source)

    expect(destination.stats).toStrictEqual({
      ...destinationDefaults.stats,
      ...source.stats
    })
  })

  it("returns a destination overwriting its default stats options with the matching source object's stats options", () => {
    const source = <{ stats: Indefinite<Stats.ToJsonOptionsObject> }>(
      createSource({
        stats: {
          assets: false,
          env: false,
          source: true
        }
      })
    )

    type DestinationWithStats = Destination & {
      stats: Indefinite<Stats.ToJsonOptionsObject>
    }
    const destination = <DestinationWithStats>createDestination(source)

    Object.keys(destinationDefaults.stats).forEach(key => {
      expect(destination.stats[key]).toBe(source.stats[key])
    })
  })

  it('returns a destination with the stats preset supplied in the source object', () => {
    const source = createSource({
      stats: 'minimal'
    })

    const destination = <Destination>createDestination(source)

    expect(destination.stats).toBe(source.stats)
  })

  it("returns a destination with default stats options if the source object's stats property is an empty object", () => {
    const source = createSource({
      stats: {}
    })

    const destination = <Destination>createDestination(source)

    expect(destination.stats).toEqual(destinationDefaults.stats)
  })

  it('returns a destination with default stats options if the source object does not have a stats property', () => {
    const { stats, ...restSource } = createSource()
    const destination = <Destination>createDestination(restSource)

    expect(destination.stats).toEqual(destinationDefaults.stats)
  })
})

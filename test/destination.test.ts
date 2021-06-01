import { Destination, toDestination } from '../src/destination'

type DestinationKeys = keyof Destination

describe('toDestination', () => {
  it('returns undefined if the source object was not provided', () => {
    expect(toDestination()).toBeUndefined()
  })

  it('returns undefined if the source object had no url property', () => {
    const source = { skip: false, statsOptions: {} }

    expect(toDestination(source)).toBeUndefined()
  })

  it('returns a destination containing all source object destination fields', () => {
    const source = {
      format: () => {},
      requestOptions: {},
      skip: false,
      statsOptions: {},
      url: 'url'
    }

    const item = toDestination(source)

    const keys: DestinationKeys[] = [
      'format',
      'requestOptions',
      'skip',
      'statsOptions',
      'url'
    ]

    keys.forEach(key => {
      expect(item?.[key]).toBe(source[key])
    })
  })
})

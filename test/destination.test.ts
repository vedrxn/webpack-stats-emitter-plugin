import fc from 'fast-check'
import { Stats } from 'webpack'
import {
  createDestination,
  Destination,
  destinationDefaults
} from '../src/destination'

describe('destinationDefaults', () => {
  it('has a stats object with source set to false', () => {
    expect(destinationDefaults.stats.source).toBe(false)
  })
})

describe('createDestination', () => {
  it('returns undefined if the source object was not provided', () => {
    const destination = createDestination()

    expect(destination).toBeUndefined()
  })

  it('returns undefined if the source object does not contain a url property', () => {
    fc.assert(
      fc.property(fc.object(), object => {
        const { url, ...rest } = object

        expect(createDestination(rest)).toBeUndefined()
      })
    )
  })

  it('returns a destination with the Destination properties, except stats, from the source object', () => {})

  it('returns a destination with a default value for its stats property when not specified', () => {})
})

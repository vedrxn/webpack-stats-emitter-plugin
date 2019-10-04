import http from 'http'
import fc from 'fast-check'
import { createDestination, Destination } from '../src/destination'
import WebpackStatsEmitterPlugin, { Options } from '../src/index'

const defaultOptions: Options = {
  url: 'http://a'
}

describe('constructor', () => {
  it('throws an error if options is missing both url and destinations', () => {
    const { destinations, url, ...restOptions } = defaultOptions

    expect(() => new WebpackStatsEmitterPlugin(restOptions)).toThrow()
  })

  test('assigns options to the instance', () => {
    const instance = new WebpackStatsEmitterPlugin(defaultOptions)

    expect(instance.options).toEqual(defaultOptions)
  })
})

describe('dispatch', () => {
  it('creates a request using the destination url having a method property and content-type headers', () => {})

  it('spreads the destination requestOptions into the request options object', () => {})
})

describe('getDestinations', () => {
  it('returns an array containing the top-level destination when provided', () => {})

  it('returns the options.destinations array when no top-level destination exists', () => {})

  it('returns an empty array when options is missing both the top-level destination and options.destinations', () => {
    const instance = new WebpackStatsEmitterPlugin(defaultOptions)

    const boundThis = { options: {} }
    const getDestinations = instance.getDestinations.bind(boundThis)

    expect(getDestinations()).toEqual([])
  })

  it('spreads the top-level destination, except url, into each destination in options.destinations', () => {})
})

describe('apply', () => {
  // See compiler hooks: https://webpack.js.org/api/compiler-hooks/#done
  it('calls the webpack compiler done hook with the plugin name and a handler function', () => {})
})

import http from 'http'
import { isEmpty, isFunction } from 'lodash/fp'
import { Compiler, Stats } from 'webpack'
import { Destination, createDestination } from './destination'

export interface Options extends Partial<Destination> {
  destinations?: Destination[]
}

export default class WebpackStatsEmitterPlugin {
  readonly options: Options
  constructor(options: Options) {
    if (!options.url && isEmpty(options.destinations)) {
      throw new Error()
    }

    this.options = options
  }
  dispatch(destination: Destination, payload: any) {
    const request = http.request(destination.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      ...destination.requestOptions
    })

    request.end(JSON.stringify(payload))
  }
  getDestinations(): Destination[] {
    const destination = createDestination(this.options)
    const destinations: Destination[] = this.options.destinations || []

    if (destination) {
      // The destination has the top-level properties we want to add to each
      // item in the destinations array, except url which should be unique.
      const { url, ...restDestination } = destination

      return destinations.reduce(
        (result, destination) =>
          result.concat({
            ...restDestination,
            ...destination
          }),
        [destination]
      )
    }

    return destinations
  }
  apply(compiler: Compiler) {
    compiler.hooks.done.tap(this.constructor.name, stats => {
      this.getDestinations().forEach(destination => {
        const _stats = stats.toJson(destination.stats)

        const isSkipped = isFunction(destination.skip)
          ? destination.skip(_stats, destination)
          : Boolean(destination.skip)

        if (isSkipped) {
          return
        }

        const payload = destination.format
          ? destination.format(_stats, destination)
          : _stats

        this.dispatch(destination, payload)
      })
    })
  }
}

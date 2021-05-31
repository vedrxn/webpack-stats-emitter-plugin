import http from 'http'
import isFunction from 'lodash/fp/isFunction'
import webpack from 'webpack'
import { Destination, toDestination } from './destination'

export interface Options extends Partial<Destination> {
  destinations?: Destination[]
}

export default class WebpackStatsEmitterPlugin {
  readonly options: Options

  constructor(options?: Options) {
    if (!options?.url && !options?.destinations?.length) {
      throw new Error()
    }

    this.options = options
  }

  send(destination: Destination, payload: any) {
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
    const destination = toDestination(this.options)
    const destinations = this.options.destinations || []

    return destination ? [destination, ...destinations] : destinations
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.done.tap(this.constructor.name, stats => {
      this.getDestinations().forEach(destination => {
        const stats_ = stats.toJson(destination.statsOptions)

        const skipped = isFunction(destination.skip)
          ? destination.skip(stats_, destination)
          : destination.skip

        if (skipped) {
          return
        }

        const payload = destination.format
          ? destination.format(stats_, destination)
          : stats_

        this.send(destination, payload)
      })
    })
  }
}

import { request } from 'http'
import { URL } from 'url'
import { isEmpty, isFunction } from 'lodash/fp'
import { Compiler, Stats } from 'webpack'
import { createDestination, Destination, pickDestination } from './destination'

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
    const req = request(destination.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      ...destination.requestOptions
    })

    req.end(JSON.stringify(payload))
  }
  getDestinations(): Destination[] {
    const properties = pickDestination(this.options) || {}
    const destinations = this.options.destinations || []

    const { url, ...restProperties } = properties

    const _destinations = destinations.map(
      destination => <Destination>createDestination({
          ...restProperties,
          ...destination
        })
    )

    const destination = createDestination(properties)

    return destination ? [destination, ..._destinations] : _destinations
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

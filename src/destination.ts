import { RequestOptions } from 'http'
import { URL } from 'url'
import { isPlainObject, pick } from 'lodash/fp'
import { Stats } from 'webpack'

type Url = string | URL

export interface Destination {
  format?: (stats: Stats.ToJsonOutput, destination: Destination) => any
  requestOptions?: RequestOptions
  skip?: (stats: Stats.ToJsonOutput, destination: Destination) => boolean
  stats?: Stats.ToJsonOptions
  url: Url
}

export const destinationDefaults: {
  stats: Partial<Stats.ToJsonOptionsObject>
} = {
  stats: {
    source: false
  }
}

export const _isPlainObject = (arg?: any): arg is { [index: string]: any } =>
  isPlainObject(arg)

type Indefinite<Type> = Type & { [index: string]: any }

export const createDestination = (
  source?: Indefinite<Partial<Destination>>
): Destination | undefined => {
  if (!source || !source.url) {
    return
  }

  const properties = ['format', 'requestOptions', 'skip', 'stats', 'url']
  const destination = <Destination>pick(properties, source)

  return {
    ...destination,
    stats: _isPlainObject(destination.stats)
      ? { ...destinationDefaults.stats, ...destination.stats }
      : destination.stats || destinationDefaults.stats
  }
}

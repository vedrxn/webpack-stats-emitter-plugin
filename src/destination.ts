import http from 'http'
import url from 'url'
import pick from 'lodash/fp/pick'
import webpack from 'webpack'

export interface Destination {
  format?: (
    stats?: webpack.Stats.ToJsonOutput,
    destination?: Destination
  ) => any
  requestOptions?: http.RequestOptions
  skip?:
    | boolean
    | ((stats: webpack.Stats.ToJsonOutput, destination: Destination) => boolean)
  statsOptions?: webpack.Stats.ToJsonOptions
  url: string | url.URL
}

export const toDestination = (source?: {
  [key: string]: any
}): Destination | undefined => {
  if (!source?.url) {
    return
  }

  const keys = ['format', 'requestOptions', 'skip', 'statsOptions', 'url']

  return pick(keys, source) as Destination
}

# WebpackStatsEmitterPlugin

WebpackStatsEmitterPlugin is a webpack plugin for sending webpack build
compilation stats to local and remote locations.

## Features

* Send stats to one or more locations
* Format stats before sending or saving
* Save stats to your disk (soon™)
* Include os and env details in stats (soon™)

## Install

Using npm:

```
npm install --save-dev webpack-stats-emitter-plugin
```

Once installed, import and add the plugin to your webpack configuration. The
plugin is configurable accepting options to customize as you like. A simple
usage example is below:

*webpack.config.js*
```
const WebpackStatsEmitterPlugin = require('webpack-stats-emitter-plugin').default

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: './dist', 
  },
  plugins: [
    new WebpackStatsEmitterPlugin({
      url: 'http://localhost:8080'
    })
  ]
}
```

Each build's stats will be sent to the specified locations, the example above
sends stats to `http://localhost:8080`. By default, the module source code will
not be included in stats. If you'd like to include it enable that in the stats
option object.

## Configuration

The plugin accepts a single argument, an options object. The documentation for
the options object is below. View the types used in this configuration,
[package types.](https://github.com/vdrn/webpack-stats-emitter-plugin)

### url

```
{ url?: Url }
```

A location for where to send stats.

### skip
  
```
{ skip?: (stats: webpack.Stats.ToJsonOutput, destination: Destination) => boolean }
```

Skip sending a build's stats, called on build completion. A boolean alternative
type coming soon™.

### format
  
```
{ format?: (stats: webpack.Stats.ToJsonOutput, destination: Destination) => any }
```

Format each build's stats to any other value on build completion. The output
will be sent to its associated location, unless skip is true. 

### stats
  
```
{ stats?: webpack.Stats.ToJsonOptions }
```

Control the contents of the webpack stats data by specifying a preset string or
options object. View the [Webpack stats
configuration](https://webpack.js.org/configuration/stats/) options or [Webpack
types](https://www.npmjs.com/package/@types/webpack) for details. In
webpack-stats-emitter-plugin, the default value for all destinations is an
options object with source set to false.

### requestOptions 
  
```
{ requestOptions?: http.RequestOptions }
```

A node http request api options object. Requests use the POST method
and add a Content-Type header set to application/json by default.

### destinations

```
{ destinations?: Destination[] }
```

An array of Destination objects, used to send stats to one or more locations on
build completion. Each destination needs a url and supports optional properties
allowing individual control over each destination's behaviour.

The plugin's top-level options object properties: `requestOptions`, `skip`,
`stats`, and `format` are spread into each destination. For example, all
destinations will use the top-level skip function unless they specify their
own. Opting out from this behaviour coming soon™.

## Resources

[Webpack stats api](https://webpack.js.org/api/stats/)
[Webpack stats configuration](https://webpack.js.org/configuration/stats/)
[Webpack types](https://www.npmjs.com/package/@types/webpack)
[Node types](https://www.npmjs.com/package/@types/node)
[Node http module](https://nodejs.org/api/http.html)

## Feedback

Have a bug or feature request? [Please open a new
issue.](https://github.com/vdrn/webpack-stats-emitter-plugin/issues/new)

## License

Matches [webpack](https://github.com/webpack/webpack/blob/master/LICENSE), here
as
[MIT](https://github.com/vdrn/webpack-stats-emitter-plugin/blob/master/LICENSE)

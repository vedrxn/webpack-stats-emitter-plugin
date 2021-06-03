import WebpackStatsEmitterPlugin from '../src/index'

const defaultOptions = {
  url: 'url'
}

describe('constructor', () => {
  it('throws an error if options is missing both url and destinations', () => {
    expect(() => new WebpackStatsEmitterPlugin({})).toThrow()
  })

  it('assigns constructor options to the instance', () => {
    const instance = new WebpackStatsEmitterPlugin(defaultOptions)

    expect(instance.options).toEqual(defaultOptions)
  })
})

describe('send', () => {
  it('calls the provided onSend options event handler', () => {
    const mock = jest.fn()

    const instance = new WebpackStatsEmitterPlugin({
      ...defaultOptions,
      onSend: mock
    })

    const destination = { url: 'http://url' }
    const payload = {}

    instance.send(destination, payload)

    expect(mock).toHaveBeenCalledWith(destination, payload)
  })
})

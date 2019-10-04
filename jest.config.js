const { defaults: jestDefaults } = require('jest-config')
const { defaults: tsjDefaults } = require('ts-jest/presets')

module.exports = {
  ...jestDefaults,
  transform: {
    ...jestDefaults.transform,
    ...tsjDefaults.transform
  }
}

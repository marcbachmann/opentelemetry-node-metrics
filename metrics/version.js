'use strict'
const NODE_VERSION_INFO = 'nodejs_version_info'

module.exports = (meter, {prefix, labels}) => {
  const versionSegments = process.version.slice(1).split('.').map(Number)

  const version = {
    ...labels,
    version: process.version,
    major: versionSegments[0],
    minor: versionSegments[1],
    patch: versionSegments[2]
  }

  meter.createUpDownCounter(prefix + NODE_VERSION_INFO, {
    description: 'Node.js version info.'
  }).add(1, version)
}

module.exports.metricNames = [NODE_VERSION_INFO]

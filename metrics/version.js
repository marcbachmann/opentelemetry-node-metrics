const NODE_VERSION_INFO = 'nodejs_version_info'

module.exports = (meter, config = {}) => {
  const namePrefix = config.prefix ? config.prefix : ''
  const labels = config.labels ? config.labels : {}

  const version = process.version
  const versionSegments = version.slice(1).split('.').map(Number)

  const withVersion = {
    ...labels,
    version,
    major: versionSegments[0],
    minor: versionSegments[1],
    patch: versionSegments[2]
  }

  meter.createValueObserver(namePrefix + NODE_VERSION_INFO, {
    description: 'Node.js version info.'
  }, (observerResult) => {
    observerResult.observe(1, withVersion)
  })
}

module.exports.metricNames = [NODE_VERSION_INFO]

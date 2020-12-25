const startInSeconds = Math.round((Date.now() / 1000) - process.uptime())
const PROCESS_START_TIME = 'process_start_time_seconds'

module.exports = (meter, config = {}) => {
  const namePrefix = config.prefix ? config.prefix : ''
  const labels = config.labels ? config.labels : {}

  meter.createValueObserver(namePrefix + PROCESS_START_TIME, {
    description: 'Start time of the process since unix epoch in seconds.'
  }, (observerResult) => {
    observerResult.observe(startInSeconds, labels)
  })
}

module.exports.metricNames = [PROCESS_START_TIME]

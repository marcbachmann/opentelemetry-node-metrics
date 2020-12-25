const {aggregateByObjectName} = require('./helpers/processMetricsHelpers')

const NODEJS_ACTIVE_REQUESTS = 'nodejs_active_requests'
const NODEJS_ACTIVE_REQUESTS_TOTAL = 'nodejs_active_requests_total'

module.exports = (meter, config = {}) => {
  // Don't do anything if the function is removed in later nodes (exists in node@6)
  if (typeof process._getActiveRequests !== 'function') return

  const namePrefix = config.prefix ? config.prefix : ''
  const labels = config.labels ? config.labels : {}

  meter.createValueObserver(namePrefix + NODEJS_ACTIVE_REQUESTS, {
    description: 'Number of active libuv requests grouped by request type. Every request type is C++ class name.' // eslint-disable-line max-len
  }, (observerResult) => {
    const requests = process._getActiveRequests()
    const data = aggregateByObjectName(requests)

    // TODO do we need to reset labels somehow?
    for (const key in data) {
      observerResult.observe(data[key], {...labels, type: key})
    }
  })

  meter.createValueObserver(namePrefix + NODEJS_ACTIVE_REQUESTS_TOTAL, {
    description: 'Total number of active requests.'
  }, (observerResult) => {
    const requests = process._getActiveRequests()
    observerResult.observe(requests.length, labels)
  })
}

module.exports.metricNames = [
  NODEJS_ACTIVE_REQUESTS,
  NODEJS_ACTIVE_REQUESTS_TOTAL
]
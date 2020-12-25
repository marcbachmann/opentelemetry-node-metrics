const {aggregateByObjectName} = require('./helpers/processMetricsHelpers')

const NODEJS_ACTIVE_HANDLES = 'nodejs_active_handles'
const NODEJS_ACTIVE_HANDLES_TOTAL = 'nodejs_active_handles_total'

module.exports = (meter, config = {}) => {
  // Don't do anything if the function is removed in later nodes (exists in node@6-12...)
  if (typeof process._getActiveHandles !== 'function') return

  const namePrefix = config.prefix ? config.prefix : ''
  const labels = config.labels ? config.labels : {}

  meter.createValueObserver(namePrefix + NODEJS_ACTIVE_HANDLES, {
    description: 'Number of active libuv handles grouped by handle type. Every handle type is C++ class name.' // eslint-disable-line max-len
  }, (observerResult) => {
    // TODO do we need to reset labels?
    const handles = process._getActiveHandles()
    const data = aggregateByObjectName(handles)
    for (const key in data) observerResult.observe(data[key], {...labels, type: key})
  })

  meter.createValueObserver(namePrefix + NODEJS_ACTIVE_HANDLES_TOTAL, {
    description: 'Total number of active handles.'
  }, (observerResult) => {
    const handles = process._getActiveHandles()
    observerResult.observe(handles.length, labels)
  })
}

module.exports.metricNames = [
  NODEJS_ACTIVE_HANDLES,
  NODEJS_ACTIVE_HANDLES_TOTAL
]

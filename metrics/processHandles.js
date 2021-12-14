'use strict'
const {createAggregatorByObjectName} = require('./helpers/processMetricsHelpers')

const NODEJS_ACTIVE_HANDLES = 'nodejs_active_handles'
const NODEJS_ACTIVE_HANDLES_TOTAL = 'nodejs_active_handles_total'

module.exports = (meter, {prefix, labels}) => {
  // Don't do anything if the function is removed in later nodes (exists in node@6-12...)
  if (typeof process._getActiveHandles !== 'function') return

  const aggregateByObjectName = createAggregatorByObjectName()
  const activeHandlesMetric = meter.createObservableGauge(prefix + NODEJS_ACTIVE_HANDLES, {
    description: 'Number of active libuv handles grouped by handle type. Every handle type is C++ class name.' // eslint-disable-line max-len
  }, () => {
    aggregateByObjectName(activeHandlesMetric, labels, process._getActiveHandles())
  })

  const boundTotalMetric = meter.createObservableGauge(prefix + NODEJS_ACTIVE_HANDLES_TOTAL, {
    description: 'Total number of active handles.'
  }, () => {
    const handles = process._getActiveHandles()
    boundTotalMetric.update(handles.length)
  }).bind(labels)
}

module.exports.metricNames = [
  NODEJS_ACTIVE_HANDLES,
  NODEJS_ACTIVE_HANDLES_TOTAL
]

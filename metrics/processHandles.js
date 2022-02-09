'use strict'
const {createAggregatorByObjectName} = require('./helpers/processMetricsHelpers')

const NODEJS_ACTIVE_HANDLES = 'nodejs_active_handles'
const NODEJS_ACTIVE_HANDLES_TOTAL = 'nodejs_active_handles_total'

module.exports = (meter, {prefix, labels}) => {
  // Don't do anything if the function is removed in later nodes (exists in node@6-12...)
  if (typeof process._getActiveHandles !== 'function') return

  const aggregateByObjectName = createAggregatorByObjectName()
  meter.createObservableGauge(prefix + NODEJS_ACTIVE_HANDLES, {
    description: 'Number of active libuv handles grouped by handle type. Every handle type is C++ class name.' // eslint-disable-line max-len
  }, (observable) => {
    aggregateByObjectName(observable, labels, process._getActiveHandles())
  })

  meter.createObservableGauge(prefix + NODEJS_ACTIVE_HANDLES_TOTAL, {
    description: 'Total number of active handles.'
  }, (observable) => {
    const handles = process._getActiveHandles()
    observable.observe(handles.length, labels)
  })
}

module.exports.metricNames = [
  NODEJS_ACTIVE_HANDLES,
  NODEJS_ACTIVE_HANDLES_TOTAL
]

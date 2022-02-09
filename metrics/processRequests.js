'use strict'
const {createAggregatorByObjectName} = require('./helpers/processMetricsHelpers')

const NODEJS_ACTIVE_REQUESTS = 'nodejs_active_requests'
const NODEJS_ACTIVE_REQUESTS_TOTAL = 'nodejs_active_requests_total'

module.exports = (meter, {prefix, labels}) => {
  // Don't do anything if the function is removed in later nodes (exists in node@6)
  if (typeof process._getActiveRequests !== 'function') return

  const aggregateByObjectName = createAggregatorByObjectName()
  meter.createObservableGauge(prefix + NODEJS_ACTIVE_REQUESTS, {
    description: 'Number of active libuv requests grouped by request type. Every request type is C++ class name.' // eslint-disable-line max-len
  }, (observable) => {
    aggregateByObjectName(observable, labels, process._getActiveRequests())
  })

  meter.createObservableGauge(prefix + NODEJS_ACTIVE_REQUESTS_TOTAL, {
    description: 'Total number of active requests.'
  }, (observable) => {
    observable.observe(process._getActiveRequests().length, labels)
  })
}

module.exports.metricNames = [
  NODEJS_ACTIVE_REQUESTS,
  NODEJS_ACTIVE_REQUESTS_TOTAL
]

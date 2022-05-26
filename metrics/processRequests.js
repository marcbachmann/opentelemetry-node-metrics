'use strict'
const {createAggregatorByObjectName} = require('./helpers/processMetricsHelpers')

const NODEJS_ACTIVE_REQUESTS = 'nodejs_active_requests'
const NODEJS_ACTIVE_REQUESTS_TOTAL = 'nodejs_active_requests_total'

/**
 * @param {import('@opentelemetry/api-metrics').Meter} meter 
 * @param {*} config 
 */
module.exports = (meter, {prefix, labels}) => {
  // Don't do anything if the function is removed in later nodes (exists in node@6)
  if (typeof process._getActiveRequests !== 'function') return

  const aggregateByObjectName = createAggregatorByObjectName()
  meter.createObservableGauge(prefix + NODEJS_ACTIVE_REQUESTS, (observable) => {
    aggregateByObjectName(observable, labels, process._getActiveRequests())
  }, {
    description: 'Number of active libuv requests grouped by request type. Every request type is C++ class name.' // eslint-disable-line max-len
  })

  meter.createObservableGauge(prefix + NODEJS_ACTIVE_REQUESTS_TOTAL, (observable) => {
    observable.observe(process._getActiveRequests().length, labels)
  }, {
    description: 'Total number of active requests.'
  })
}

module.exports.metricNames = [
  NODEJS_ACTIVE_REQUESTS,
  NODEJS_ACTIVE_REQUESTS_TOTAL
]

'use strict'
const perfHooks = require('perf_hooks')

// Reported always.
const NODEJS_EVENTLOOP_LAG = 'nodejs_eventloop_lag_seconds'

// Reported only when perf_hooks is available.
const NODEJS_EVENTLOOP_LAG_MIN = 'nodejs_eventloop_lag_min_seconds'
const NODEJS_EVENTLOOP_LAG_MAX = 'nodejs_eventloop_lag_max_seconds'
const NODEJS_EVENTLOOP_LAG_MEAN = 'nodejs_eventloop_lag_mean_seconds'
const NODEJS_EVENTLOOP_LAG_STDDEV = 'nodejs_eventloop_lag_stddev_seconds'
const NODEJS_EVENTLOOP_LAG_P50 = 'nodejs_eventloop_lag_p50_seconds'
const NODEJS_EVENTLOOP_LAG_P90 = 'nodejs_eventloop_lag_p90_seconds'
const NODEJS_EVENTLOOP_LAG_P99 = 'nodejs_eventloop_lag_p99_seconds'

module.exports = (meter, {prefix, labels, eventLoopMonitoringPrecision}) => {
  const histogram = perfHooks.monitorEventLoopDelay({
    resolution: eventLoopMonitoringPrecision
  })

  histogram.enable()

  const lag = meter.createObservableGauge(prefix + NODEJS_EVENTLOOP_LAG, {
    description: 'Lag of event loop in seconds.'
  }).bind(labels)

  const lagMin = meter.createObservableGauge(prefix + NODEJS_EVENTLOOP_LAG_MIN, {
    description: 'The minimum recorded event loop delay.'
  }).bind(labels)

  const lagMax = meter.createObservableGauge(prefix + NODEJS_EVENTLOOP_LAG_MAX, {
    description: 'The maximum recorded event loop delay.'
  }).bind(labels)

  const lagMean = meter.createObservableGauge(prefix + NODEJS_EVENTLOOP_LAG_MEAN, {
    description: 'The mean of the recorded event loop delays.'
  }).bind(labels)

  const lagStddev = meter.createObservableGauge(prefix + NODEJS_EVENTLOOP_LAG_STDDEV, {
    description: 'The standard deviation of the recorded event loop delays.'
  }).bind(labels)

  const lagP50 = meter.createObservableGauge(prefix + NODEJS_EVENTLOOP_LAG_P50, {
    description: 'The 50th percentile of the recorded event loop delays.'
  }).bind(labels)

  const lagP90 = meter.createObservableGauge(prefix + NODEJS_EVENTLOOP_LAG_P90, {
    description: 'The 90th percentile of the recorded event loop delays.'
  }).bind(labels)

  const lagP99 = meter.createObservableGauge(prefix + NODEJS_EVENTLOOP_LAG_P99, {
    description: 'The 99th percentile of the recorded event loop delays.'
  }, async () => {
    const startTime = process.hrtime()
    await new Promise((resolve) => setImmediate(() => resolve()))

    const delta = process.hrtime(startTime)
    const nanosec = (delta[0] * 1e9) + delta[1]
    const seconds = nanosec / 1e9
    lag.update(seconds)

    lagMin.update(histogram.min / 1e9)
    lagMax.update(histogram.max / 1e9)
    lagMean.update(histogram.mean / 1e9)
    lagStddev.update(histogram.stddev / 1e9)
    lagP50.update(histogram.percentile(50) / 1e9)
    lagP90.update(histogram.percentile(90) / 1e9)
    lagP99.update(histogram.percentile(99) / 1e9)
  }).bind(labels)

  lag.update(0)
}

module.exports.metricNames = [
  NODEJS_EVENTLOOP_LAG,
  NODEJS_EVENTLOOP_LAG_MIN,
  NODEJS_EVENTLOOP_LAG_MAX,
  NODEJS_EVENTLOOP_LAG_MEAN,
  NODEJS_EVENTLOOP_LAG_STDDEV,
  NODEJS_EVENTLOOP_LAG_P50,
  NODEJS_EVENTLOOP_LAG_P90,
  NODEJS_EVENTLOOP_LAG_P99
]

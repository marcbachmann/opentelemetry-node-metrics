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

  const lagMin = meter.createValueObserver(prefix + NODEJS_EVENTLOOP_LAG_MIN, {
    description: 'The minimum recorded event loop delay.'
  })
  const lagMax = meter.createValueObserver(prefix + NODEJS_EVENTLOOP_LAG_MAX, {
    description: 'The maximum recorded event loop delay.'
  })
  const lagMean = meter.createValueObserver(prefix + NODEJS_EVENTLOOP_LAG_MEAN, {
    description: 'The mean of the recorded event loop delays.'
  })
  const lagStddev = meter.createValueObserver(prefix + NODEJS_EVENTLOOP_LAG_STDDEV, {
    description: 'The standard deviation of the recorded event loop delays.'
  })
  const lagP50 = meter.createValueObserver(prefix + NODEJS_EVENTLOOP_LAG_P50, {
    description: 'The 50th percentile of the recorded event loop delays.'
  })
  const lagP90 = meter.createValueObserver(prefix + NODEJS_EVENTLOOP_LAG_P90, {
    description: 'The 90th percentile of the recorded event loop delays.'
  })
  const lagP99 = meter.createValueObserver(prefix + NODEJS_EVENTLOOP_LAG_P99, {
    description: 'The 99th percentile of the recorded event loop delays.'
  })

  const lag = meter.createValueObserver(prefix + NODEJS_EVENTLOOP_LAG, {
    description: 'Lag of event loop in seconds.'
  })

  function reportEventloopLag (start, observerBatchResult) {
    const delta = process.hrtime(start)
    const nanosec = (delta[0] * 1e9) + delta[1]
    const seconds = nanosec / 1e9
    observerBatchResult.observe(labels, [lag.observation(seconds)])
  }

  meter.createBatchObserver((observerBatchResult) => {
    setImmediate(reportEventloopLag, process.hrtime(), observerBatchResult)

    observerBatchResult.observe(labels, [
      lagMin.observation(histogram.min / 1e9),
      lagMax.observation(histogram.max / 1e9),
      lagMean.observation(histogram.mean / 1e9),
      lagStddev.observation(histogram.stddev / 1e9),
      lagP50.observation(histogram.percentile(50) / 1e9),
      lagP90.observation(histogram.percentile(90) / 1e9),
      lagP99.observation(histogram.percentile(99) / 1e9)
    ])
  })

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

'use strict'
const startInSeconds = Math.round((Date.now() / 1000) - process.uptime())
const PROCESS_START_TIME = 'process_start_time_seconds'

module.exports = (meter, {prefix, labels}) => {
  meter.createUpDownCounter(prefix + PROCESS_START_TIME, {
    description: 'Start time of the process since unix epoch in seconds.'
  }).add(startInSeconds, labels)
}

module.exports.metricNames = [PROCESS_START_TIME]

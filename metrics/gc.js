'use strict'
const perfHooks = require('perf_hooks')

const NODEJS_GC_DURATION_SECONDS = 'nodejs_gc_duration_seconds'
const DEFAULT_GC_DURATION_BUCKETS = [0.001, 0.01, 0.1, 1, 2, 5]

const kinds = []
kinds[perfHooks.constants.NODE_PERFORMANCE_GC_MAJOR] = 'major'
kinds[perfHooks.constants.NODE_PERFORMANCE_GC_MINOR] = 'minor'
kinds[perfHooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL] = 'incremental'
kinds[perfHooks.constants.NODE_PERFORMANCE_GC_WEAKCB] = 'weakcb'

module.exports = (meter, {prefix, labels, gcDurationBuckets}) => {
  const boundaries = gcDurationBuckets || DEFAULT_GC_DURATION_BUCKETS

  const gcHistogram = meter.createValueRecorder(prefix + NODEJS_GC_DURATION_SECONDS, {
    description: 'Garbage collection duration by kind, one of major, minor, incremental or weakcb.',
    boundaries
  })

  const obs = new perfHooks.PerformanceObserver(list => {
    const entry = list.getEntries()[0]

    gcHistogram
      .bind({...labels, kind: kinds[entry.kind]})
      // Convert duration from milliseconds to seconds
      .record(entry.duration / 1000)
  })

  // We do not expect too many gc events per second, so we do not use buffering
  obs.observe({entryTypes: ['gc'], buffered: false})
}

module.exports.metricNames = [NODEJS_GC_DURATION_SECONDS]

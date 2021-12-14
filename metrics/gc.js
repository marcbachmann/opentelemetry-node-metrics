'use strict'
const {PerformanceObserver, constants} = require('perf_hooks')

const NODEJS_GC_DURATION_SECONDS = 'nodejs_gc_duration_seconds'
const DEFAULT_GC_DURATION_BUCKETS = [0.001, 0.01, 0.1, 1, 2, 5]

module.exports = (meter, {prefix, labels, gcDurationBuckets}) => {
  const boundaries = gcDurationBuckets || DEFAULT_GC_DURATION_BUCKETS

  const histogram = meter.createHistogram(prefix + NODEJS_GC_DURATION_SECONDS, {
    description: 'Garbage collection duration by kind, one of major, minor, incremental or weakcb.',
    boundaries
  })

  const kinds = {}
  kinds[constants.NODE_PERFORMANCE_GC_MAJOR] = histogram.bind({...labels, kind: 'major'})
  kinds[constants.NODE_PERFORMANCE_GC_MINOR] = histogram.bind({...labels, kind: 'minor'})
  kinds[constants.NODE_PERFORMANCE_GC_INCREMENTAL] = histogram.bind({...labels, kind: 'incremental'}) // eslint-disable-line max-len
  kinds[constants.NODE_PERFORMANCE_GC_WEAKCB] = histogram.bind({...labels, kind: 'weakcb'})

  const obs = new PerformanceObserver(list => {
    const entry = list.getEntries()[0]
    // Convert duration from milliseconds to seconds
    kinds[entry.detail ? entry.detail.kind : entry.kind].record(entry.duration / 1000)
  })

  // We do not expect too many gc events per second, so we do not use buffering
  obs.observe({entryTypes: ['gc'], buffered: false})
}

module.exports.metricNames = [NODEJS_GC_DURATION_SECONDS]

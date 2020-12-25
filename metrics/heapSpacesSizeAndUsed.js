const v8 = require('v8')
const METRICS = ['total', 'used', 'available']
const NODEJS_HEAP_SIZE = {}

for (const metricType of METRICS) {
  NODEJS_HEAP_SIZE[metricType] = `nodejs_heap_space_size_${metricType}_bytes`
}

module.exports = (meter, {prefix, labels}) => {
  const gauges = {}
  for (const metricType of METRICS) {
    gauges[metricType] = meter.createValueObserver(prefix + NODEJS_HEAP_SIZE[metricType], {
      description: `Process heap space size ${metricType} from Node.js in bytes.`
    })
  }

  meter.createBatchObserver((observerBatchResult) => {
    for (const space of v8.getHeapSpaceStatistics()) {
      const spaceName = space.space_name.substr(0, space.space_name.indexOf('_space'))
      observerBatchResult.observe({space: spaceName, ...labels}, [
        gauges.total.observation(space.space_size),
        gauges.used.observation(space.space_used_size),
        gauges.available.observation(space.space_available_size)
      ])
    }
  })
}

module.exports.metricNames = Object.values(NODEJS_HEAP_SIZE)

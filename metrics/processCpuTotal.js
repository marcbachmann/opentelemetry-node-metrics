'use strict'
const PROCESS_CPU_USER_SECONDS = 'process_cpu_user_seconds_total'
const PROCESS_CPU_SYSTEM_SECONDS = 'process_cpu_system_seconds_total'
const PROCESS_CPU_SECONDS = 'process_cpu_seconds_total'

module.exports = (meter, {prefix, labels}) => {
  let lastCpuUsage = process.cpuUsage()

  const cpuUserUsageCounter = meter.createCounter(prefix + PROCESS_CPU_USER_SECONDS, {
    description: 'Total user CPU time spent in seconds.'
  })

  const cpuSystemUsageCounter = meter.createCounter(prefix + PROCESS_CPU_SYSTEM_SECONDS, {
    description: 'Total system CPU time spent in seconds.'
  })

  meter.createObservableCounter(prefix + PROCESS_CPU_SECONDS, {
    description: 'Total user and system CPU time spent in seconds.'
  }, (cpuUsageCounter) => {
    const cpuUsage = process.cpuUsage()
    const userUsageSecs = (cpuUsage.user - lastCpuUsage.user) / 1e6
    const systemUsageSecs = (cpuUsage.system - lastCpuUsage.system) / 1e6
    lastCpuUsage = cpuUsage

    cpuUserUsageCounter.add(userUsageSecs, labels)
    cpuSystemUsageCounter.add(systemUsageSecs, labels)
    cpuUsageCounter.observe((cpuUsage.user + cpuUsage.system) / 1e6, labels)
  })

  cpuUserUsageCounter.add(lastCpuUsage.user / 1e6, labels)
  cpuSystemUsageCounter.add(lastCpuUsage.system / 1e6, labels)
}

module.exports.metricNames = [
  PROCESS_CPU_USER_SECONDS,
  PROCESS_CPU_SYSTEM_SECONDS,
  PROCESS_CPU_SECONDS
]

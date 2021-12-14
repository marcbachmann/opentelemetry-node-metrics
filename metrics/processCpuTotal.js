'use strict'
const PROCESS_CPU_USER_SECONDS = 'process_cpu_user_seconds_total'
const PROCESS_CPU_SYSTEM_SECONDS = 'process_cpu_system_seconds_total'
const PROCESS_CPU_SECONDS = 'process_cpu_seconds_total'

module.exports = (meter, {prefix, labels}) => {
  let lastCpuUsage = process.cpuUsage()

  const cpuUserUsageCounter = meter.createCounter(prefix + PROCESS_CPU_USER_SECONDS, {
    description: 'Total user CPU time spent in seconds.'
  }).bind(labels)

  const cpuSystemUsageCounter = meter.createCounter(prefix + PROCESS_CPU_SYSTEM_SECONDS, {
    description: 'Total system CPU time spent in seconds.'
  }).bind(labels)

  const cpuUsageCounter = meter.createCounter(prefix + PROCESS_CPU_SECONDS, {
    description: 'Total user and system CPU time spent in seconds.'
  }, () => {
    const cpuUsage = process.cpuUsage()
    const userUsageMicros = cpuUsage.user - lastCpuUsage.user
    const systemUsageMicros = cpuUsage.system - lastCpuUsage.system
    lastCpuUsage = cpuUsage

    cpuUserUsageCounter.add(userUsageMicros / 1e6)
    cpuSystemUsageCounter.add(systemUsageMicros / 1e6)
    cpuUsageCounter.add((userUsageMicros + systemUsageMicros) / 1e6)
  }).bind(labels)
}

module.exports.metricNames = [
  PROCESS_CPU_USER_SECONDS,
  PROCESS_CPU_SYSTEM_SECONDS,
  PROCESS_CPU_SECONDS
]

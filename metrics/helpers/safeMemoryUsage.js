'use strict'
// process.memoryUsage() can throw on some platforms, see https://github.com/siimon/prom-client/issues/67
module.exports = function safeMemoryUsage () {
  try { return process.memoryUsage() } catch {}
}

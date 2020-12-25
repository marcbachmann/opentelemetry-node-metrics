# opentelemetry-node-metrics

This module is an adoption of the metric set of [`prom-client`](https://www.npmjs.com/package/prom-client) for [`@opentelemetry/metrics`](https://www.npmjs.com/package/@opentelemetry/metrics).

There's no node cluster support as `@opentelemetry/metrics` doesn't support it.

### Usage

```js
const {MeterProvider} = require('@opentelemetry/metrics');
const {PrometheusExporter} = require('@opentelemetry/exporter-prometheus');

const exporter = new PrometheusExporter({startServer: true}, () => {
  console.log(
    `prometheus scrape endpoint: http://localhost:${PrometheusExporter.DEFAULT_OPTIONS.port}${PrometheusExporter.DEFAULT_OPTIONS.endpoint}`,
  )
})

const meterProvider = new MeterProvider({
  exporter,
  interval: 2000,
})

require('./index')(meterProvider)
```


## License

This project heavily relies on code from https://github.com/siimon/prom-client
and therefore I'd like to thank to all the contributors.

The `prom-client` project is using an APACHE v2.0 LICENSE and threfore it's best to apply the same license to this project.

This module is only a proof of concept to get opentelemetry to work with the metrics support of `prom-client`.

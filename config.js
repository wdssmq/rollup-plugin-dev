import Joi from 'joi'

const proxyItem = Joi.object({
  from: Joi.string().uri({ relativeOnly: true }),
  to: Joi.string().uri(),
  opts: Joi.object()
})

const schema = Joi.alternatives().try(
  Joi.string(),
  Joi.object({
    silent: Joi.boolean(),
    force: Joi.boolean(),
    proxy: Joi.array().items(proxyItem),
    dirs: Joi.array().items(Joi.string()),
    dirname: Joi.string(),
    spa: [Joi.boolean(), Joi.string()],
    port: Joi.number().port(),
    host: [Joi.string().ip(), Joi.string().hostname()],
    basePath: Joi.string().uri({ relativeOnly: true }),
    extend: Joi.function(),
    server: Joi.object(),
    onListen: Joi.function()
  })
)

export const serverDefaults = Object.freeze({
  ignoreTrailingSlash: true,
  disableRequestLogging: true
})

const pluginServer = Object.freeze({
  logger: {
    transport: {
      target: "#pinoPretty",
      // target: "pino-pretty",
      options: {
        colorize: true,
      },
    }
  }
})

export const defaults = {
  cors: {
    origin: "*",
    methods: ["GET"]
  },
  proxy: [],
  dirs: ['.'],
  port: 8080,
  host: 'localhost',
  spa: false,
  silent: false,
  force: false,
  server: {
    ...pluginServer,
    ...serverDefaults
  },
  basePath: undefined,
  extend: undefined,
  dirname: undefined,
  onListen: undefined
}

export const normalize = (rollupOptions = {}) => {
  const parsed = Joi.attempt(rollupOptions, schema)
  const normalized = (typeof parsed === 'string') ? { dirs: [parsed] } : parsed
  const serverConfig = Object.assign({}, defaults.server, normalized.server)
  const config = Object.assign({}, defaults, normalized)
  config.server = serverConfig
  if (config.silent) config.server.logger = false
  return config
}

import Fastify from 'fastify'
import proxy from './proxy.js'
import dirs from './dirs.js'
import spa from './spa.js'
import timing from 'fastify-request-timing'
import cors from '@fastify/cors'
import { responseLogger } from './logger.js'

export async function init(config = {}) {
  const server = Fastify(config.server)
  await server.register(proxy, config)
  await server.register(dirs, config)
  await server.register(spa, { ...config, prefix: config.basePath })
  await server.register(timing)
  await server.register(cors, config.cors)
  await server.register(responseLogger)
  if (config.extend) await server.register(config.extend, config)
  await server.ready()

  return server
}

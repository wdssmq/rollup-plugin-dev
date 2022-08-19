import fp from 'fastify-plugin'
// import dateTime from './_date-time.js'
import ms from 'ms'
import { bold, blue, dim, yellow, red, cyan, green } from 'femtocolor'

// const EOL = '\n'
const colorCodes = { 5: red, 4: yellow, 3: cyan, 2: green }
const getColor = status => colorCodes[Math.trunc(status / 100)]

export const responseLogger = fp(async server => {
  const logResponse = async (req, reply) => {
    const status = reply.statusCode
    const c = getColor(status)
    const timing = ms(parseInt(reply.getResponseTime())) || ''
    server.log.info(bold(c(req.method)) + ' ' + req.url + c(' • ') + dim(status + ' • ' + timing))
  }
  server.addHook('onResponse', logResponse)
})

export const header = blue('⚡︎dev-server')

export const logDir = (server) => (dir) => server.log.info(header + ' serving ' + bold(dir))
export const logSpa = (server, spaFile) => server.log.info(header + ' using fallback file ' + bold(spaFile))
export const logProxy = (server, from, to) => server.log.info(header + ' proxying from ' + bold(yellow(from)) + ' to ' + bold(yellow(to)))

const http = require('http')
const config = require('./utils/config')
const app = require('./app')
const info = require('./utils/logger')

const server = http.createServer(app)


server.listen(config.PORT , () => {
  info(`Server is listening on port ${config.PORT}`)
})


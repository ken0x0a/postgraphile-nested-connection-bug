import app from './app'
import { env } from './config/env'

const port = env.API_SERVER_PORT
const host = process.env.SERVER_HOST || 'localhost'

const server = app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`)
})

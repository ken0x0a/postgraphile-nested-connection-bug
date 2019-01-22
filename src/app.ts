import Koa from 'koa'
import { postgraphileHandler } from './config/postgraphile'

import { env } from './config/env'

const graphqlPath = env.API_GRAPHQL_PATH

const app = new Koa()

app.use(postgraphileHandler)

export default app

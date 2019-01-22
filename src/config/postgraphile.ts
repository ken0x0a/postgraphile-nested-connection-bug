import postgraphile, { PostGraphileOptions } from 'postgraphile'
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter'
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'
import PostGraphileNestedMutations from 'postgraphile-plugin-nested-mutations'
// import { NodePlugin } from 'postgraphile/node_modules/graphile-build'
import { env } from './env'

export const pgConfig = {
  // env.DATABASE_URL || "postgres:///"
  host: env.API_GRAPHILE_DB_HOST,
  port: env.API_GRAPHILE_DB_PORT,
  user: env.API_GRAPHILE_DB_USER,
  password: env.API_GRAPHILE_DB_PASSWORD,
  database: env.API_GRAPHILE_DB_DATABASE,
  // connectionString
}

export const schemaName = ['app_public']
// const jwtSecret = process.env.JWT_PUBLIC_KEY

// https://www.graphile.org/postgraphile/usage-library/
export const options: PostGraphileOptions = {
  /**
   * `additionalGraphQLContextFromRequest` is necessary only if we use
   * - SetInputObjectDefaultValuePlugin,
   */
  additionalGraphQLContextFromRequest: async (req, _res) => ({
    user_id: '1',
  }),
  pgSettings: async (req) => ({
    role: `graph_user`,
    // 'jwt.claims.role': req.user.role ? `graph_${req.user.role}` : 'void',
    'jwt.claims.user_id': '1',
    //...
  }),
  graphqlRoute: env.API_GRAPHQL_PATH,
  legacyRelations: 'omit',
  // list of plugins here: https://www.graphile.org/postgraphile/community-plugins/
  appendPlugins: [PgSimplifyInflectorPlugin, ConnectionFilterPlugin, PostGraphileNestedMutations],
  dynamicJson: true,
  bodySizeLimit: '200kB',
  ignoreRBAC: false,
  simpleCollections: 'both',
  // skipPlugins: [NodePlugin],
  watchPg: true,
  // pgDefaultRole: 'void',
  // ignoreIndexes: false,
  queryCacheMaxSize: 50, // in "MB unit"
  // pgDefaultRole: 'noop',
  // ...(jwtSecret
  //   ? {
  //       jwtSecret,
  //       jwtRole: ['role'],
  //       jwtVerifyOptions: {
  //         algorithms: ['RS512'],
  //       },
  //     }
  //   : {}),
  ...(!__DEV__ && {
    disableQueryLog: true,
  }),
  ...(__DEV__ && {
    graphiql: true,
    graphiqlRoute: '/graphiql',
    enhanceGraphiql: true,
    exportGqlSchemaPath: `${process.cwd()}/__generated__/schema.graphql`,
    exportJsonSchemaPath: `${process.cwd()}/__generated__/schema.json`,
  }),
  //
  graphileBuildOptions: {
    // https://github.com/mlipscombe/postgraphile-plugin-nested-mutations
    nestedMutationsDeleteOthers: true,
    nestedMutationsSimpleFieldNames: true,
    // https://github.com/graphile-contrib/postgraphile-plugin-connection-filter#plugin-options
    connectionFilterOperatorNames: {
      equalTo: '_eq',
      notEqualTo: '_ne',
      lessThan: '_lt',
      greaterThan: '_gt',
      lessThanOrEqualTo: '_lt_eq',
      greaterThanOrEqualTo: '_gt_eq',
      likeInsensitive: '_ilike',
      includes: '_includes',
      startsWithInsensitive: '_iStartWith',
      includesInsensitive: '_iIncludes',
    },
    connectionFilterAllowNullInput: false,
  },
}

export const postgraphileHandler = postgraphile(pgConfig, schemaName, options)

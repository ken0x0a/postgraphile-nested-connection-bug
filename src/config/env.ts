import * as Yup from 'yup'

const envVarSchema = Yup.object({
  API_GRAPHILE_DB_HOST: Yup.string().required(),
  API_GRAPHILE_DB_USER: Yup.string().required(),
  API_GRAPHILE_DB_PORT: Yup.number().required(),
  API_GRAPHILE_DB_PASSWORD: Yup.string(),
  API_GRAPHILE_DB_DATABASE: Yup.string().required(),
  API_GRAPHILE_DB_SSL: Yup.boolean().required(),

  API_GRAPHQL_PATH: Yup.string().required(),
  API_SERVER_PORT: Yup.number()
    .positive()
    .integer()
    .min(3000)
    .required(),
}).noUnknown()

export const env = envVarSchema.validateSync({
  API_GRAPHILE_DB_HOST: process.env.API_GRAPHILE_DB_HOST!,
  API_GRAPHILE_DB_USER: process.env.API_GRAPHILE_DB_USER!,
  API_GRAPHILE_DB_PORT: parseInt(process.env.API_GRAPHILE_DB_PORT!),
  API_GRAPHILE_DB_PASSWORD: process.env.API_GRAPHILE_DB_PASSWORD!,
  API_GRAPHILE_DB_DATABASE: process.env.API_GRAPHILE_DB_DATABASE!,
  API_GRAPHILE_DB_SSL: process.env.API_GRAPHILE_DB_SSL === 'true',

  API_SERVER_PORT: parseInt(process.env.API_SERVER_PORT!),
  API_GRAPHQL_PATH: process.env.API_GRAPHQL_PATH!,
})

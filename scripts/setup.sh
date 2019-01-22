#!/bin/bash

echo "Are you sure to reset all database?"
echo "You will lost all your data."
echo "Do you want to continue?"

while true; do
    read -p "Yes or No  " yn
    case $yn in
        [Yy] ) echo "continue install..."; break;;
        [Nn]* ) exit 1;;
        * ) echo "Please answer Yes or no.";;
    esac
done

set -e
export NODE_ENV=development

if [ -f .env ]; then
  eval "$(grep -v '^#' .env | sed -E 's|^(.+)=(.*)$|\1='\''\2'\''|g')"

  if [ "$SUPERUSER_PASSWORD" = "" ]; then
    echo ".env already exists, but it doesn't define SUPERUSER_PASSWORD - aborting!"
    exit 1;
  fi
  if [ "$AUTH_USER_PASSWORD" = "" ]; then
    echo ".env already exists, but it doesn't define AUTH_USER_PASSWORD - aborting!"
    exit 1;
  fi
  echo "Configuration already exists, using existing secrets."
else
  # This will generate passwords that are safe to use in envvars without needing to be escaped:
  SUPERUSER_PASSWORD="$(openssl rand -base64 64 | tr '+/\n' '-__')"
  AUTH_USER_PASSWORD="$(openssl rand -base64 64 | tr '+/\n' '-__')"
  AUTH_SERVER_PG_PASSWORD="$(openssl rand -base64 64 | tr '+/' '-_' | tr -d '\n')"

  # This is our '.env' config file, we're writing it now so that if something goes wrong we won't lose the passwords.
  cat >> .env <<CONFIG

# Password for the 'service_admin' user, which owns the database
SUPERUSER_PASSWORD=$SUPERUSER_PASSWORD

# Password for the 'graph_auth' user, which has very limited
# privileges, but can switch into pg_user
AUTH_USER_PASSWORD=$AUTH_USER_PASSWORD

AUTH_SERVER_PG_PASSWORD=$AUTH_SERVER_PG_PASSWORD

# This secret is used for signing cookies
SECRET=$(openssl rand -base64 48)

# This secret is used for signing JWT tokens (we don't use this by default)
JWT_SECRET=$(openssl rand -base64 48)


# These are the connection strings for the DB and the test DB.
ROOT_DATABASE_URL=postgresql://service_admin:$SUPERUSER_PASSWORD@localhost/service
AUTH_DATABASE_URL=postgresql://graph_auth:$AUTH_USER_PASSWORD@localhost/service
TEST_ROOT_DATABASE_URL=postgresql://service_admin:$SUPERUSER_PASSWORD@localhost/service_test
TEST_AUTH_DATABASE_URL=postgresql://graph_auth:$AUTH_USER_PASSWORD@localhost/service_test

# This port is the one you'll connect to
PORT=5005

# This is needed any time we use absolute URLs, e.g. for OAuth callback URLs
ROOT_DOMAIN=localhost:$PORT
ROOT_URL=http://$ROOT_DOMAIN

# Our session store uses redis
REDIS_URL=redis://localhost/6379

CONFIG
  echo "Passwords generated and configuration written to .env"

  eval "$(grep -v '^#' .env | sed -E 's|^(.+)=(.*)$|\1='\''\2'\''|g')"
fi


echo "Installing or reinstalling the roles and database..."
# Now we can reset the database
# this line might work "only" on Mac OS
tail -n +10 sql/000_database.psql | psql -X -v ON_ERROR_STOP=1 template1

# echo "Prepare Functions & Triggers sql by script"
# yarn ts scripts/generate-sql.ts

echo "Roles and databases created, now sourcing the initial database schema"
psql -X1 -v ON_ERROR_STOP=1 "${ROOT_DATABASE_URL}" -f sql/reset.psql

echo "Dumping full SQL schema to data/schema.psql"
./scripts/schema_dump

echo "Exporting GraphQL schema to data/schema.graphql and data/schema.json"
yarn postgraphile -c "$ROOT_DATABASE_URL" -X --export-schema-graphql __generated__/schema.graphql --export-schema-json __generated__/schema.json

# All done
echo "✅ Setup success"

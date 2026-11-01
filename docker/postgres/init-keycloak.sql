\getenv kc_db KEYCLOAK_DB
\getenv kc_user KEYCLOAK_DB_USER
\getenv kc_password KEYCLOAK_DB_PASSWORD

SELECT format('CREATE ROLE %I LOGIN', :'kc_user')
WHERE NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = :'kc_user'
)
\gexec

SELECT format('ALTER ROLE %I PASSWORD %L', :'kc_user', :'kc_password')
\gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'kc_db', :'kc_user')
WHERE NOT EXISTS (
    SELECT 1 FROM pg_database WHERE datname = :'kc_db'
)
\gexec
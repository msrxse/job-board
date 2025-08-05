This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker DB

- We run our database on a docker container. Using Drizzle and postgreSQL.
- Se below on database run and initial setup.

```
docker run --name job-board-drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres
```

1. The --name option assigns the container the name drizzle-postgres.
2. The -e POSTGRES_PASSWORD= option sets the POSTGRES_PASSWORD environment variable with the specified value.
3. The -d flag runs the container in detached mode (in the background).
4. The -p option maps port 5432 on the container to port 5432 on your host machine, allowing PostgreSQL to be accessed from your host system through this port.
5. The postgres argument specifies the image to use for the container. You can also specify other versions like postgres:15.

You can also specify other parameters like:

6. The -e POSTGRES_USER= option sets the POSTGRES_USER environment variable with the specified value. Postgres uses the default user when this is empty. Most of the time, it is postgres and you can check it in the container logs in Docker Desktop or by running docker logs <container_name>.
7. The -e POSTGRES_DB= option sets the POSTGRES_DB environment variable with the specified value. Defaults to the POSTGRES_USER value when is empty.

## DB migrations

- We are using a plain postgresql database on a docker container
- Any changes to the schema and you need to create a db migration. Implies generating the SQL migration files based on your Drizzle schema and then apply those changes to your database.

```
npm run db:generate
npm run db:migrate
```

## Seeding the DB

```
bun tsx src/db/seed.ts
```

## Ensure docker container is started

```
docker start drizzle-postgres
```

## How to check postgres database in docker volume

```
docker ps // get container-id from output

<!-- Access the docker container -->
docker exec -it <CONTAINER _ID> bash

<!-- Connect to the postgresql db -->
psql -U <db_user> -d <db_name>

<!-- or all together -->
<!-- docker exec -it {CONTAINER _ID} psql -U {USERNAME} -d {postgres db name} -->
<!-- for example: docker exec -it 6587f794d1ac psql -U postgres -d postgres -->

<!-- Navigate and inspect db -->
\l  // list all dbs

\c // connect to the default db
\c <DATABASE_NAME> // connect to a different db

\dt // view tables on current db

postgres=#  // this is the command prompt you should be seeing

<!-- Any SQL allowed now (see data folder for some seeding SQL) -->

SELECT * FROM customers;
SELECT * FROM tickets; // press q to exit

\q // to quit psql

exit // to exit the docker container prompt

```

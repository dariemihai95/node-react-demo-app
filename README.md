# node-react-demo-app
ExpressJs Openapi Typescript server


prerequisites:

docker & docker-compose
# install

- to create a local postgres db use `docker run --name postgres-db -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

- to build and run server in a docker container:
`cd backend`
`docker build -t express-api .`
`docker run --name node-express-api -p 55770:8080 -d express-api`

- to build and run app in a docker container:
`cd demo-app`
`docker build -t react-app .`
`docker run --name react-typescript-app -p 3000:3000 -d react-app`
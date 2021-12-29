# node-react-demo-app
## ExpressJs Openapi Typescript React app

### prerequisites:

- node
- java
- yarn (recommended) (yarn.lock already generated, can use npm as well)
- docker & docker-compose
# Install

The application will run on localhost:3000

## easy installation - docker-compose way

run:
```
- docker-compose up
```

## docker way

- to create a local postgres db use:
```
- docker run --name postgres-db -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

- to build and run server in a docker container:
```
- cd backend
- docker build -t express-api .
- docker run --name node-express-api -p 55770:8080 -d express-api
```

- to build and run app in a docker container:
```
- cd demo-app
- docker build -t react-app .
- docker run --name react-typescript-app -p 3000:3000 -d react-app
```

## harder way

- create and use local db:
```
- docker run --name postgres-db -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

- go to backend/src/config/database.ts and modify host to match your needs: default "localhost"

- go to backend folder and run:
```
- yarn
- yarn openapi
- yarn start
```

- then on demo-app folder run:
```
- yarn
- yarn openapi
- yarn start
```
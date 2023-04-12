## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)

## General info
Files service that provides uploading files to AWS S3.

1. At the beginning server generates presigned url (with content type, name and time limitation)
2. The user sends files directly to S3
3. Finally, user sends information about the state of action to the server

## Technologies
* NestJS
* Knex migrations
* PostgreSQL raw queries
* Jest
* Docker
* CircleCI
	
## Setup
### Run
```
# Build
$ docker-compose build

# Start
$ docker-compose up -d
```

### Migration
```
$ docker-compose run api npm run migration
```

### Test
```
$ docker-compose run api npm run test
```

## Features
* Validates user token
* Uploads files to AWS S3
* Saves information about uploaded files

### To Do:
* Retrieve information about files

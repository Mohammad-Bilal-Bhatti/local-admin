

# Local Stack Admin

## About

This is a hobby project to make localstack administration easy.

A minimal localstack ui

Inspired by official localstack pro ui and other open source projects like. aws-quick-ui, sqs-ui, s3-ui

## License

MIT - No Warrenty - Distribute Copies free of charge.

## Prerequisites

- Nodejs
- Nestjs cli
- Docker
- Aws cli (optional)
- Localstack cli (optional)
- Awslocal cli (optional) https://github.com/localstack/awscli-local

## Development

1. See configure AWS profile section.
2. Create environment file `$ cp env.sample .env`
3. Install dependencies `$ npm install`
4. Start localstack container `$ docker compose up -d`
5. Start development server `$ npm run start:dev`

## Development Via Docker

If you dont want to configure development environment yourself and try run the application then just use the following command.

Spin up localstack container
`$ docker compose -f local.yml up -d`

Spin up application container if you have already localstack container up and running
`$ docker compose up -d`

Stop localstack container
`$ docker compose -f local.yml down`

Stop application container
`$ docker compose down`

> Note: In order to run via docker compose you still have to create .env file by `$ cp env.sample .env`

> Note: If you see `Error: connect ECONNREFUSED ::1:4566` change the environment variable configuration from `localhost:4566` to `127.0.0.1:4566`

## Configure AWS Profile

> Following configuration is required if you are running this on your local host using npm. Alternatively you can use docker.

Configure aws localstack profile
`$ aws configure --profile localstack`

Note: If you have already aws default profile configuration leave this part.
Configure aws default profile (required if not configure already) other wise you will get credential provider issue
`$ aws configure` 

Follow the instruction and provide dummy values as follows
- AWS Access Key ID [None]: localstack
- AWS Secret Access Key [None]: localstack
- Default region name [None]: us-west-2
- Default output format [None]: json

## Configuration Localstack Endpoint and Region

To configure localstack endpoint and region use following page to configure it http://localhost:8443/configure

If you are using local.yml to spin up localstack container use following environment variable for
`LOCALSTACK_ENDPOINT=http://host.docker.internal:4566` to bridge container and host network 

## Technologies used
- Nodejs (Runtime)
- Nestjs (Framework)
- Handlebars (Templating Engine)
- Localstack (AWS Services Emulation)
- Docker (Container Virtualization)
- Bootstrap 5
- Bootstrap 5 icons

## Debug

- List localstack services status `$ localstack status services`
- Show application logs `$ docker compose logs -ft`
- Show localstack logs running via docker compose `$ docker compose -f local.yml logs -ft`


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

Create environment file
`$ cp env.sample .env`

Install dependencies
`$ npm install`

Start localstack container
`$ docker compose up -d`

Start development server
`$ npm run start:dev`

## Development Via Docker

If you dont want to configure development environment yourself and try run the application then just use the following command.

Will spin up locastack and application container
`$ docker compose up -d`

## Configure

> Following configuration is required if you are running this on your local host using npm. Alternatively you can use docker.

Configure aws localstack profile
`$ aws configure --profile localstack`

Note: If you have already aws default profile configuration leave this part.
Configure aws default profile (required if not configure already) other wise you will get credential provider issue
`$ aws configure` 

Follow the instruction and provide dummy values as follows

> AWS Access Key ID [None]: localstack
> AWS Secret Access Key [None]: localstack
> Default region name [None]: us-west-2
> Default output format [None]: json


## Debug

List localstack services status
`$ localstack status services`
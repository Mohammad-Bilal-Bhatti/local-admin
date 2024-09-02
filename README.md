

# Local Stack Admin

## About

This is a hobby project to make localstack administration easy.

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


## Configure

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
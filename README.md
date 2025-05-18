

# Local Stack Admin

## Overview

This is a hobby project to make localstack administration easy. A minimal localstack ui.

Inspired by official localstack pro ui and other open source projects like. aws-quick-ui, sqs-ui, s3-ui

Provides UI for most of the services available in the community version of the localstack.


## Run using docker compose
You can easilly spin up local-admin container and integrate it with your workflow. By simplying pulling docker image named `devbilalbhatti/local-admin`. 

Following is the sample docker compose to spin up community version of locastack and local-admin.

```yaml
version: '3.8'
services:
  localstack:
    image: localstack/localstack
    ports:
      - "127.0.0.1:4566:4566"            # LocalStack Gateway
      - "127.0.0.1:4510-4559:4510-4559"  # external services port range
    environment:
      # LocalStack configuration: https://docs.localstack.cloud/references/configuration/
      - DEBUG=${LOCALSTACK_DEBUG:-0}
      - SERVICES=s3,sns,sqs
    volumes:
      - "${LOCALSTACK_VOLUME_DIR:-./volume}:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
    networks:
      - securenet

  local-admin:
    container_name: local_admin
    image: devbilalbhatti/local-admin
    restart: unless-stopped
    environment:
      - APP_PORT=80
      - APP_TIMEOUT=50000
      - LOCALSTACK_ENDPOINT=http://localstack:4566 # Make sure you are pointing to locastack container host.
      - LOCALSTACK_REGION=us-east-1
    ports:
      - 8080:80
    depends_on:
      - localstack      
    networks:
      - securenet # Make sure containers are added to same network - to make communication possible between app and localstack.

networks:
  securenet:
    driver: bridge
```
### Debugging

> Note: If you are not able to see your localstack resources make sure your aws-region is configured correctly. You can temporarily configure it by navigating to http://localhost:8080/configuration


## Local Development
### Prerequisites
Following are prerequisites when developing locally.

- Nodejs
- Nestjs cli
- Docker
- Aws cli (optional)
- Localstack cli (optional)
- Awslocal cli (optional) https://github.com/localstack/awscli-local

### Development

1. See configure AWS profile section.
2. Create environment file `$ cp env.sample .env`
3. Install dependencies `$ npm install`
4. Start localstack container `$ docker compose up -d`
5. Start development server `$ npm run start:dev`

### Development Via Docker

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


## License

MIT - No Warrenty - Distribute Copies free of charge.

# AWS Serverless Typescript Boilerplate

The Serverless Framework provide a tool to deploy AWS services without too much DevOps overhead.

## Keys features

- AWS
- Node 10.X compatibility
- Webpack Support
- TypeScript
- Jest
- Code Linting with eslint
- Code formatting with Prettier

## Tools

- AWS Lambda
- Amazon DynamoDB
- Amazon Cognito
- Amazon S3 (in progress)
- Amazon CloudFront (in progress)

## Quick start

```bash
npm install
# Amend your AWS profile in the [serverless.yml](serverless.yml) file. Currently named YOUR_PROFILE.
npm run deploy
```

## Testing

### Jest Unit Testing

```bash
npm run test:unit
```

### Integration

## Commands

### Quick local script running

We found setting an env variable for the profile before running works:
env "AWS_PROFILE=<your profile>" serverless invoke local --function hello --path events/hello.json

```bash
npm run watch:hello
```

### Logs

Going to the AWS lambda console is slow and not really user-friendly. You can retrieve the log from your deployed AWS Lambda from your project's command line.

```bash
"tail:hello:dev": "serverless logs --function hello --tail --stage dev --aws-profile <your profile>"
```

### Deploy individually

```bash
npm run deploy:hello
```

## TODO

- CI Integration

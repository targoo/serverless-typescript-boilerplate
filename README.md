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

To run the hello function with the event data defined in [fixtures/event.json](./fixtures/event.json) (with live reloading), run:

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

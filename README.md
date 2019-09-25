# Serverless Typescript Boilerplate

## Keys features

The current Serverless Starter Kit adds a light layer on top of the Serverless framework with modern JavaScript Tools:

- Babel / Webpack Support so you can use the Modern ESNext features
- TypeScript Support
- Unit testing with Jest
- Linting with Eslint
- Formatting with Prettier
- ESLint and Prettier are both run on git commit thanks to `husky` and `lint-staged`.

## Tools

Currently, the boilterplate is built and tested on AWS using the following services.

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

## Serverless plugins

- serverless-prune-plugin: This plugin allows pruning of all but the most recent version(s) of managed functions from AWS
- serverless-dotenv-plugin

## TODO

- CI Integration

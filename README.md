# ⚡️ Serverless Typescript Boilerplate ⚡️

Minimalist but yet supercharged project template to jump start a Serverless application in TypeScript.

## Motivation

Serverless is awesome : no more server to setup, ultra scalable and very cheap. But getting started can be intimidating. The boilerplate will save you a considerable amount of time and energy.

## Keys features

The current Serverless Starter Kit adds a light layer on top of the Serverless framework with modern JavaScript tools:

- **Babel / Webpack** Support so you can use the Modern ESNext features.
- **TypeScript** Support.
- Unit testing with **Jest** and code coverage
- Linting with **Eslint**
- **Offline** mode
- Full CRUD **DynamoDB**
- Formatting with Prettier to enforce a consistent code style.
- ESLint and Prettier are both run on git commit thanks to `husky` and `lint-staged`.

## Services

Currently, the boilerplate is built and tested on AWS using the following services.

- AWS Lambda
- Amazon DynamoDB
- Amazon Cognito
- Amazon S3 (in progress)
- Amazon CloudFront (in progress)

## Quick start

```bash
nvm use
npm install
# Amend your AWS profile in the [serverless.yml](serverless.yml) file. Search for YOUR_PROFILE.
npm run deploy
```

## Testing

### Jest Unit Testing

```bash
npm run test:unit
```

### Integration

## Commands

### Local

```bash
npm run local
```

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

### More

- `npm run clean`: remove coverage data, Jest cache and transpiled files.
- `npm run lint`: lint source files and tests.
- `npm test`: run tests.

## Serverless plugins

- [serverless-prune-plugin](https://www.npmjs.com/package/serverless-prune-plugin): Allows pruning of all but the most recent version(s) of managed functions from AWS
- [serverless-offline](https://github.com/dherault/serverless-offline): run your services offline for e.g. testing
- [serverless-webpack](https://github.com/elastic-coders/serverless-webpack): optimize package size with webpack
- [serverless-iam-roles-per-function](https://www.npmjs.com/package/serverless-iam-roles-per-function): Enable setting roles on a per function basis
- [serverless-plugin-split-stacks](https://github.com/dougmoscrop/serverless-plugin-split-stacks): Split Cloudformation stack to multiple stacks to overcome the 200 resource limit
- [serverless-dynamodb-local](https://www.npmjs.com/package/serverless-dynamodb-local): Install DynamoDB Local

## Files structure

webpack.config.js: Webpack default config file

## TODO

- CI Integration
- Explore the serverless-dotenv-plugin plugin.
- https://serverless.com/blog/structuring-a-real-world-serverless-app/
- https://medium.com/innomizetech/top-serverless-plugins-we-are-using-f02df901bbbf

## License

Serverless Boilerplate is [MIT licensed](https://opensource.org/licenses/MIT).

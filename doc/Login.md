# Logging

Logging events is done by custom winston logger instance. Currently the following log transports are defined:

## Transport

### Console

#### How to use

```es6
import logger from '../../utils/logger';

// Simple log message.
logger.info('I have something to report');
// String substitution.
logger.warn('I have %d reasons to warn you', 42);
// Log with metadata.
logger.error('There is something wrong', { errorCode: 'ERROR_100' });
// Log with substitution and metadata.
logger.log('info', 'This is a test message %s, %s', 'first', 'second', { errorCode: 'ERROR_100' });
```

### Log levels

The logger follows the npm log severity tiers, possible values are: 'error', 'warn', 'info', 'verbose', 'debug', 'silly'.

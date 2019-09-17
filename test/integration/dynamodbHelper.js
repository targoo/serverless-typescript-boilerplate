const AWS = require('aws-sdk');

// Connect to the local dynamoDB.
const docClient = new AWS.DynamoDB({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
});

// Prefix database.
export const stage = test;

// Save set of data
export const setData = (dataSet, done) => {
  const buildSetData = { RequestItems: {} };
  dataSet.forEach(data => {
    buildSetData.RequestItems[data.table] = data.items.map(Item => ({ PutRequest: { Item } }));
  });
  docClient.batchWriteItem(buildSetData, err => {
    if (err) return done(err);
    return done();
  });
};

// Remove all data from database names
export const emptyTables = (tableNames, done) => {
  const that = this;
  if (tableNames.length === 0) return done();
  const tableName = tableNames[0];
  const reduceTableNames = tableNames.slice(1, tableNames.length);
  const scanParams = {
    TableName: tableName.table,
  };
  return docClient.scan(scanParams, (err, data) => {
    if (err) return done(err);
    const buildDeleteData = {
      RequestItems: { [scanParams.TableName]: [] },
    };
    data.Items.forEach(obj => {
      const hashkeys = {};
      tableName.hashKey.forEach(key => {
        hashkeys[key] = obj[key];
      });
      buildDeleteData.RequestItems[scanParams.TableName].push({ DeleteRequest: { Key: hashkeys } });
    });
    return docClient.batchWriteItem(buildDeleteData, error => {
      if (error) return done(error);
      return that.emptyTables(reduceTableNames, done);
    });
  });
};

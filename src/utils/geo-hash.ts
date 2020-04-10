// const ddbGeo = require('dynamodb-geo');

// const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'yourTableName');
// config.hashKeyLength = 5;
// const myGeoTableManager = new ddbGeo.GeoDataManager(config);
// const setupTable = () => {
//   const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);

//   createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5;
//   console.dir(createTableInput, { depth: null });
//   ddb
//     .createTable(createTableInput)
//     .promise()
//     .then(function () {
//       return ddb.waitFor('tableExists', { TableName: config.tableName }).promise();
//     })
//     .then(function () {
//       console.log('Table created and ready!');
//     });
// };

import axios from 'axios';
// import { setData, emptyTables } from '../../dynamodbHelper';

beforeAll(async () => {
  // testApp = new TestApp();
  //await testApp.start();
});

afterAll(() => {
  // testApp.stop();
});

describe('API — board', () => {
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000,
  });

  // it('GET /board', async () => {
  //   const { data } = await instance.get('/board');
  //   console.log(data);
  //   // status
  //   // data
  //   // expect(data).toEqual('Mark');
  // });
});

import { handler } from '../../../../src/modules/hello/status';

describe('handler', () => {
  it('executes as expected', () => {
    const cb = jest.fn();
    handler({}, {}, cb);
    expect(cb).toHaveBeenCalled();
    expect(cb).toMatchSnapshot();
  });
});

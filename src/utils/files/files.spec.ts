import { isFileNameValid, sanitizeFileName } from './files';

describe('isFileNameValid', () => {
  it.each`
    filename                      | expected
    ${'.jpeg'.padStart(10, 'x')}  | ${true}
    ${'.jpeg'.padStart(255, 'x')} | ${true}
    ${'.jpeg'.padStart(256, 'x')} | ${false}
    ${'.jpeg'.padStart(257, 'x')} | ${false}
  `('should return $expected based on the length of $filename', ({ filename, expected }) => {
    // Act
    const result = isFileNameValid(filename);

    expect(result).toBe(expected);
  });

  it.each`
    filename       | expected
    ${'test.jpeg'} | ${true}
    ${'test.tiff'} | ${true}
    ${'test.pdf'}  | ${true}
    ${'test.jpg'}  | ${true}
    ${'test.png'}  | ${true}
    ${'test.JPEG'} | ${true}
    ${'test.exe'}  | ${false}
  `('should return $expected based on the extension of $filename', ({ filename, expected }) => {
    // Act
    const result = isFileNameValid(filename);

    expect(result).toBe(expected);
  });
});

describe('sanitizeFileName', () => {
  it.each`
    filename               | expected
    ${'test.jpeg'}         | ${'test.jpeg'}
    ${'TEST.jpeg'}         | ${'test.jpeg'}
    ${'test%.jpeg'}        | ${'test.jpeg'}
    ${'test\x1f.jpeg'}     | ${'test.jpeg'}
    ${'test/?<>\\:*.jpeg'} | ${'test.jpeg'}
  `('should sanitize the filename of $filename', ({ filename, expected }) => {
    // Act
    const result = sanitizeFileName(filename);

    expect(result).toBe(expected);
  });
});

export function isFileNameValid(filename: string) {
  // Limit the filename length
  if (filename.length > 255) {
    return false;
  }

  // Check the extension.
  if (!filename.toLowerCase().match(/\.(jpg|jpeg|png|tiff|pdf)$/)) {
    return false;
  }
  return true;
}

export function sanitizeFileName(filename: string) {
  const extensionIndex = filename.lastIndexOf('.');
  const name = filename.slice(0, extensionIndex);
  const extension = filename.slice(extensionIndex + 1);
  // eslint-disable-next-line no-control-regex
  let validatedName = name.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  validatedName = name.replace(/[^a-zA-Z0-9-_]/g, '');

  return `${validatedName}.${extension}`.toLowerCase();
}

export function isFileMinetypeValid(mimetype: string, validMimetypes: Map<string, string>) {
  return !!validMimetypes.get(mimetype);
}

export function isFileSizeValid(size) {
  // Limit the file size to a maximum value in order to prevent denial of service attacks.
  // Restrict small size files as they can lead to denial of service attacks.
  const defaultMaxSize = 100000;
  const defaultMinSize = 1;
  return size < defaultMaxSize && size > defaultMinSize;
}

import generate from 'nanoid/generate';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export default function generateID() {
  return generate(alphabet, 16);
}

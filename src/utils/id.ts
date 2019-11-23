const generate = require('nanoid/generate');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export default function generateID() {
  const uuid: string = generate(alphabet, 16);
  return uuid;
}

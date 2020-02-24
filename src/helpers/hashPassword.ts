import * as crypto from 'crypto'

// TODO: this is too weak, needs to be changed for production
export default (str: string) =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

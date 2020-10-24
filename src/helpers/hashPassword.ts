import crypto from 'crypto'

// TODO: this is too weak, needs to be changed for production
export default function (str: string): string {
  return crypto.createHash('md5').update(str).digest('hex')
}

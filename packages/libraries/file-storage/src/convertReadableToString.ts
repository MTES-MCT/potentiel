import { Readable } from 'stream';

export async function convertReadableToString(readable: Readable): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let data = '';

    readable.setEncoding('utf8');

    readable.on('data', (chunk: string) => {
      console.log(chunk);
      data += chunk;
    });

    readable.on('end', () => {
      resolve(data);
    });

    readable.on('error', (error: Error) => {
      reject(error);
    });
  });
}

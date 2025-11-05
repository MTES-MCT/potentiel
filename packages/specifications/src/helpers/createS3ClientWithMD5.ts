import { createHash } from 'node:crypto';

import { S3Client } from '@aws-sdk/client-s3';
import { HttpRequest } from '@smithy/types';

type Args = {
  request: HttpRequest;
};

/**
 * Creates an S3 client that uses MD5 checksums for DeleteObjects operations
 */
export function createS3ClientWithMD5() {
  const endpoint = process.env.S3_ENDPOINT || '';

  const client = new S3Client({
    endpoint,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  });

  // Add middleware to remove any SDK-added checksums and add MD5 instead
  // This happens at the 'build' stage, before the request is signed
  client.middlewareStack.add(
    (next, context) => async (args) => {
      const typedArgs = args as Args;

      // Check if this is a DeleteObjects command
      const isDeleteObjects = context.commandName === 'DeleteObjectsCommand';
      if (!isDeleteObjects) {
        return next(args);
      }

      const headers = typedArgs.request.headers;

      // Remove any checksum headers
      Object.keys(headers).forEach((header) => {
        if (
          header.toLowerCase().startsWith('x-amz-checksum-') ||
          header.toLowerCase().startsWith('x-amz-sdk-checksum-')
        ) {
          delete headers[header];
        }
      });

      // Add MD5
      if (typedArgs.request.body) {
        const bodyContent = Buffer.from(typedArgs.request.body);
        // Create a new hash instance for each request
        headers['Content-MD5'] = createHash('md5').update(bodyContent).digest('base64');
      }

      return await next(args);
    },
    {
      step: 'build',
    },
  );
  return client;
}

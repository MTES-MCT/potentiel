import { Readable } from 'stream';
import { makeS3FileStorageService } from './S3FileStorageService';
import dotenv from 'dotenv';
dotenv.config();

const accessKeyId = process.env.LEGACY_S3_ACCESS_KEY_ID!;
const secretAccessKey = process.env.LEGACY_S3_SECRET_ACCESS_KEY!;
const bucket = process.env.LEGACY_S3_BUCKET!;
const endpoint = process.env.LEGACY_S3_ENDPOINT!;

describe.skip('S3FileStorageService', () => {
  const fakePath = `test/fakeFile-${Date.now()}.txt`;

  describe('upload', () => {
    let uploadedFileId: string;

    describe('given a proper bucket', () => {
      it('bucket and endpoint should not be undefined', () => {
        expect(bucket).toBeDefined();
        expect(endpoint).toBeDefined();
      });

      if (!bucket) return;
      if (!endpoint) return;

      const fileStorageService = makeS3FileStorageService({
        accessKeyId,
        secretAccessKey,
        endpoint,
        bucket,
      });

      afterAll(async () => {
        if (uploadedFileId) await fileStorageService.remove(uploadedFileId);
      });

      it('should call the client upload', async () => {
        const fakeContents = Readable.from(['test']);

        const result = await fileStorageService.upload({ contents: fakeContents, path: fakePath });

        expect(result.isOk()).toBe(true);

        if (result.isErr()) return;

        uploadedFileId = result.value;

        expect(result.value).toEqual(`S3:${bucket}:${fakePath}`);
      });
    });

    describe('given a wrong bucket', () => {
      it('should return an error', async () => {
        expect(endpoint).toBeDefined();
        if (!endpoint) return;

        const fileStorageService = makeS3FileStorageService({
          accessKeyId,
          secretAccessKey,
          endpoint,
          bucket: 'CONTAINERTHATDOESNTEXIST',
        });
        const fakeContents = Readable.from(['test']);
        const result = await fileStorageService.upload({ contents: fakeContents, path: fakePath });

        expect(result.isErr()).toBe(true);
      });
    });
  });

  describe('download', () => {
    it('bucket and endpoint should not be undefined', () => {
      expect(bucket).toBeDefined();
      expect(endpoint).toBeDefined();
    });

    if (!bucket) return;
    if (!endpoint) return;

    const fileStorageService = makeS3FileStorageService({
      accessKeyId,
      secretAccessKey,
      endpoint,
      bucket,
    });

    describe('given an existing file', () => {
      let uploadedFileId: string;

      beforeAll(async () => {
        const fakeContents = Readable.from(['test']);
        const result = await fileStorageService.upload({ contents: fakeContents, path: fakePath });

        expect(result.isOk()).toBe(true);
        if (result.isErr()) return;

        uploadedFileId = result.value;
      });

      afterAll(async () => {
        if (uploadedFileId) await fileStorageService.remove(uploadedFileId);
      });

      it('should retrieve the file from the S3 storage', async () => {
        const result = await fileStorageService.download(uploadedFileId);

        expect(result.isOk()).toBe(true);
        if (result.isErr()) return;

        const downloadedFile = await new Promise((resolve, reject) => {
          let fileContents = '';
          result.value.on('data', (chunk) => {
            fileContents += chunk;
          });
          result.value.on('error', (err) => {
            reject(err);
          });
          result.value.on('end', () => {
            resolve(fileContents);
          });
        });

        expect(downloadedFile).toEqual('test');
      });
    });
  });
});

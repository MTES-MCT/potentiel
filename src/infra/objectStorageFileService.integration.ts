import { Readable } from 'stream'
import {
  ObjectStorageFileService,
  ObjectStorageIdentifier,
} from './objectStorageFileService'

const authUrl = process.env.OS_AUTH_URL
const region = process.env.OS_REGION
const username = process.env.OS_USERNAME
const password = process.env.OS_PASSWORD

describe.skip('objectStorageFileService', () => {
  const fakePath = 'test/fakeFile.txt'
  let storage: ObjectStorageFileService

  beforeAll(async () => {
    storage = new ObjectStorageFileService(
      {
        provider: 'openstack',
        keystoneAuthVersion: 'v3',
        authUrl,
        region,
        username,
        password,
        // @ts-ignore
        domainId: 'default',
      },
      'Potentiel'
    )
  })

  beforeEach(async () => {})

  describe('ObjectStorageFileService.save', () => {
    let uploadedFileId: ObjectStorageIdentifier
    const fakeFile = {
      path: fakePath,
      stream: Readable.from(['test']),
    }

    describe('given a proper storage client', () => {
      afterAll(async () => {
        if (uploadedFileId) await storage.remove(uploadedFileId)
      })
      it('should call the client upload', async () => {
        const result = await storage.save(fakeFile)

        if (result.isErr()) console.log('error on save', result.error)
        expect(result.isOk()).toBe(true)

        if (result.isErr()) return

        uploadedFileId = result.value
      })
    })

    describe('given a wrong container', () => {
      it('should return an error', async () => {
        const badStorage = new ObjectStorageFileService(
          {
            provider: 'openstack',
            keystoneAuthVersion: 'v3',
            authUrl,
            region,
            username,
            password,
            // @ts-ignore
            domainId: 'default',
          },
          'CONTAINERTHATDOESNTEXIST'
        )

        const result = await badStorage.save(fakeFile)

        expect(result.isErr()).toBe(true)

        if (result.isOk()) return
      })
    })
  })

  describe('ObjectStorageFileService.load', () => {
    const fakeFile = {
      path: fakePath,
      stream: Readable.from(['test']),
    }

    describe('given an existing file', () => {
      let uploadedFileId: ObjectStorageIdentifier

      beforeAll(async () => {
        const result = await storage.save(fakeFile)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        uploadedFileId = result.value
      })

      it('should retrieve the file from the object storage', async () => {
        const result = await storage.load(uploadedFileId)

        if (result.isErr()) console.log('error on load', result.error)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        const downloadedFile = await new Promise((resolve, reject) => {
          let fileContents = ''
          result.value.stream.on('data', (chunk) => {
            fileContents += chunk
          })
          result.value.stream.on('error', (err) => {
            reject(err)
          })
          result.value.stream.on('end', () => {
            resolve(fileContents)
          })
        })

        expect(downloadedFile).toEqual('test')
      })
    })
  })
})

import { Readable } from 'stream'
import { ObjectStorageFileStorageService } from './objectStorageFileStorageService'
import dotenv from 'dotenv'
dotenv.config()

const authUrl = process.env.OS_AUTH_URL
const region = process.env.OS_REGION
const username = process.env.OS_USERNAME
const password = process.env.OS_PASSWORD
const container = process.env.OS_CONTAINER

describe.skip('objectStorageFileStorageService', () => {
  const fakePath = 'test/fakeFile' + Date.now() + '.txt'
  let storage: ObjectStorageFileStorageService

  beforeAll(async () => {
    storage = new ObjectStorageFileStorageService(
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
      container
    )
  })

  beforeEach(async () => {})

  describe('ObjectStorageFileStorageService.save', () => {
    let uploadedFileId: string
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

        expect(result.value).toEqual('objectStorage:' + container + ':' + fakePath)
      })
    })

    describe('given a wrong container', () => {
      it('should return an error', async () => {
        const badStorage = new ObjectStorageFileStorageService(
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
      })
    })
  })

  describe.skip('ObjectStorageFileStorageService.load', () => {
    const fakeFile = {
      path: fakePath,
      stream: Readable.from(['test']),
    }

    describe('given an existing file', () => {
      let uploadedFileId: string

      beforeAll(async () => {
        const result = await storage.save(fakeFile)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        uploadedFileId = result.value
      })

      afterAll(async () => {
        if (uploadedFileId) await storage.remove(uploadedFileId)
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

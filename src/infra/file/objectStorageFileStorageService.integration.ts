import { Readable } from 'stream'
import { makeObjectStorageFileStorageService } from './objectStorageFileStorageService'
import dotenv from 'dotenv'
import { ProviderOptions } from 'pkgcloud'
dotenv.config()

const authUrl = process.env.OS_AUTH_URL
const region = process.env.OS_REGION
const username = process.env.OS_USERNAME
const password = process.env.OS_PASSWORD
const container = process.env.OS_CONTAINER

const providerOptions: ProviderOptions = {
  provider: 'openstack',
  keystoneAuthVersion: 'v3',
  authUrl,
  region,
  username,
  password,
  // @ts-ignore
  domainId: 'default',
}

describe.skip('objectStorageFileStorageService', () => {
  const fakePath = `test/fakeFile-${Date.now()}.txt`

  describe('upload', () => {
    let uploadedFileId: string

    describe('given a proper container', () => {
      expect(container).toBeDefined()
      if (!container) return

      const fileStorageService = makeObjectStorageFileStorageService(providerOptions, container)

      afterAll(async () => {
        if (uploadedFileId) await fileStorageService.remove(uploadedFileId)
      })

      it('should call the client upload', async () => {
        const fakeContents = Readable.from(['test'])

        const result = await fileStorageService.upload({ contents: fakeContents, path: fakePath })

        if (result.isErr()) console.log('error on save', result.error)
        expect(result.isOk()).toBe(true)

        if (result.isErr()) return

        uploadedFileId = result.value

        expect(result.value).toEqual('objectStorage:' + container + ':' + fakePath)
      })
    })

    describe('given a wrong container', () => {
      it('should return an error', async () => {
        const fileStorageService = makeObjectStorageFileStorageService(
          providerOptions,
          'CONTAINERTHATDOESNTEXIST'
        )
        const fakeContents = Readable.from(['test'])
        const result = await fileStorageService.upload({ contents: fakeContents, path: fakePath })

        expect(result.isErr()).toBe(true)
      })
    })
  })

  describe('download', () => {
    expect(container).toBeDefined()
    if (!container) return

    const fileStorageService = makeObjectStorageFileStorageService(providerOptions, container)

    describe('given an existing file', () => {
      let uploadedFileId: string

      beforeAll(async () => {
        const fakeContents = Readable.from(['test'])
        const result = await fileStorageService.upload({ contents: fakeContents, path: fakePath })

        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        uploadedFileId = result.value
      })

      afterAll(async () => {
        if (uploadedFileId) await fileStorageService.remove(uploadedFileId)
      })

      it('should retrieve the file from the object storage', async () => {
        const result = await fileStorageService.download(uploadedFileId)

        if (result.isErr()) console.log('error on load', result.error)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        const downloadedFile = await new Promise((resolve, reject) => {
          let fileContents = ''
          result.value.on('data', (chunk) => {
            fileContents += chunk
          })
          result.value.on('error', (err) => {
            reject(err)
          })
          result.value.on('end', () => {
            resolve(fileContents)
          })
        })

        expect(downloadedFile).toEqual('test')
      })
    })
  })
})

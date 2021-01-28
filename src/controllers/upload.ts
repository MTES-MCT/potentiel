import multer from 'multer'
import fs from 'fs'
import { promisify } from 'util'
import { logger } from '../core/utils'

const deleteFile = promisify(fs.unlink)

const FILE_SIZE_LIMIT_MB = 50
const uploadWithMulter = multer({
  dest: 'temp',
  limits: { fileSize: FILE_SIZE_LIMIT_MB * 1024 * 1024 /* MB */ },
})

// export const upload = uploadWithMulter

export const upload = {
  single: (filename: string) => (req, res, next) => {
    res.on('finish', async () => {
      try {
        await deleteFile(req.file.path)
      } catch (error) {
        logger.error(error)
      }
    })

    return uploadWithMulter.single(filename)(req, res, next)
  },
}

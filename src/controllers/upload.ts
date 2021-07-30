import multer from 'multer'
import { promises as fs } from 'fs'
import { logger } from '../core/utils'

const FILE_SIZE_LIMIT_MB = 50
const uploadWithMulter = multer({
  dest: 'temp',
  limits: { fileSize: FILE_SIZE_LIMIT_MB * 1024 * 1024 /* MB */ },
})

export const upload = {
  single: (filename: string) => (req, res, next) => {
    res.on('finish', async () => {
      if (req.file) {
        try {
          await fs.unlink(req.file.path)
        } catch (error) {
          logger.error(error)
        }
      }
    })

    return uploadWithMulter.single(filename)(req, res, next)
  },
  multiple: (filename?: string) => (req, res, next) => {
    return filename
      ? uploadWithMulter.array(filename)(req, res, next)
      : uploadWithMulter.any()(req, res, next)
  },
}

import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import PizZip from 'pizzip'
import util from 'util'
import { logger } from '../core/utils'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

interface DocxTemplateProps {
  templatePath: string
  outputPath: string
  injectImage?: string
  variables: Record<string, string>
}

export const fillDocxTemplate = async ({
  templatePath,
  outputPath,
  injectImage,
  variables,
}: DocxTemplateProps) => {
  const templateBinary = await readFile(templatePath, 'binary')

  const zipFile = new PizZip(templateBinary)

  const doc = new Docxtemplater(zipFile)
  doc.setData(variables)
  doc.render()

  if (injectImage) {
    try {
      const imageContents = await readFile(injectImage, 'binary')
      zipFile.file('word/media/image1.png', imageContents, { binary: true })
    } catch (e) {
      // If image is not found, ignore it
      logger.error(e)
    }
  }
  await writeFile(outputPath, doc.getZip().generate({ type: 'nodebuffer' }))
}

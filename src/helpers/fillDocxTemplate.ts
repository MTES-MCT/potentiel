import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import path from 'path'
import util from 'util'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

interface DocxTemplateProps {
  templatePath: string
  outputPath: string
  variables: Record<string, string>
}

export const fillDocxTemplate = async ({
  templatePath,
  outputPath,
  variables,
}: DocxTemplateProps) => {
  const templateBinary = await readFile(templatePath, 'binary')

  let doc
  try {
    doc = new Docxtemplater(new PizZip(templateBinary))
  } catch (e) {
    console.log('fillDocxTemplate errored at new Docxtemplate()', e)
    throw e
  }

  doc.setData(variables)
  try {
    doc.render()
  } catch (e) {
    console.log('fillDocxTemplate errored at doc.render()', e)
    throw e
  }

  await writeFile(outputPath, doc.getZip().generate({ type: 'nodebuffer' }))
}

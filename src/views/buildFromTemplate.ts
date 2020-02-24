import * as fs from 'fs'
import * as path from 'path'

console.log(process.cwd())

const headerPartial = fs.readFileSync(
  path.resolve(__dirname, './template/header.html.partial')
)
const footerPartial = fs.readFileSync(
  path.resolve(__dirname, './template/footer.html.partial')
)

export default function buildForTemplate(contents: string): string {
  return headerPartial + contents + footerPartial
}

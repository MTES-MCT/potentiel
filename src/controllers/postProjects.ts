import csvParse from 'csv-parse'
import fs from 'fs'
import util from 'util'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { importProjects } from '../useCases'
import { ERREUR_FORMAT_LIGNE } from '../useCases/importProjects'

const deleteFile = util.promisify(fs.unlink)

const parse = file =>
  new Promise<Array<Record<string, string>>>((resolve, reject) => {
    const data: Array<Record<string, string>> = []
    fs.createReadStream(file)
      .pipe(
        csvParse({
          delimiter: ';',
          columns: true
        })
      )
      .on('data', (row: Record<string, string>) => {
        data.push(row)
      })
      .on('error', e => {
        reject(e)
      })
      .on('end', () => {
        resolve(data)
      })
  })

const tryImportProjects = async ({ periode, headers, lines }) => {
  // try Call the importProject useCase
  try {
    await importProjects({
      periode,
      headers,
      lines
    })

    return {
      redirect: ROUTES.ADMIN_DASHBOARD,
      query: {
        success: 'Les candidats ont bien été importés.'
      }
    }
  } catch (error) {
    console.log('Caught an error after importProjects', error)

    if (error.error === ERREUR_FORMAT_LIGNE) {
      return {
        redirect: ROUTES.ADMIN_DASHBOARD,
        query: {
          error: error.errorLong
        }
      }
    }

    return {
      redirect: ROUTES.ADMIN_DASHBOARD,
      query: {
        error: error.error
      }
    }
  }
}

const postProjects = async (request: HttpRequest) => {
  // console.log('Call to postProjects received', request.body, request.file)

  if (!request.file || !request.file.path) {
    return {
      redirect: ROUTES.ADMIN_DASHBOARD,
      query: { error: 'Le fichier candidat est manquant.' }
    }
  }

  // Parse the csv file
  const lines = await parse(request.file.path)
  const headers = (lines.length && Object.keys(lines[0])) || []

  const result = await tryImportProjects({
    periode: request.body.periode,
    headers,
    lines
  })

  // remove temp file
  await deleteFile(request.file.path)

  return result
}
export { postProjects }

import ReactPDF, { Font } from '@react-pdf/renderer'
import dotenv from 'dotenv'
import { errAsync, Queue, ResultAsync } from '@core/utils'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { IllegalProjectStateError } from '@modules/project/errors'
import { OtherError } from '@modules/shared'
import { Certificate } from './Certificate'
import { Laureat } from './Laureat'
import { Elimine } from './Elimine'

dotenv.config()

Font.register({
  family: 'Arial',
  fonts: [
    {
      src: process.env.BASE_URL + '/fonts/arial.ttf',
    },
    {
      src: process.env.BASE_URL + '/fonts/arial-bold.ttf',
      fontWeight: 'bold',
    },
  ],
})

const queue = new Queue()

/* global NodeJS */
const makeCertificate = (
  project: ProjectDataForCertificate
): ResultAsync<NodeJS.ReadableStream, IllegalProjectStateError | OtherError> => {
  const { appelOffre } = project
  const { periode } = appelOffre || {}

  if (!appelOffre || !periode) {
    return errAsync(
      new IllegalProjectStateError({ appelOffre: 'appelOffre et/ou periode manquantes' })
    )
  }

  let content

  if (project.isClasse) {
    content = Laureat(project)
  } else {
    content = Elimine(project)
  }

  const certificate = Certificate({ ...content })

  const ticket = queue.push(() => ReactPDF.renderToStream(certificate))

  return ResultAsync.fromPromise(ticket, (e: any) => new OtherError(e.message))
}

export { makeCertificate }

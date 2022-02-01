import ReactPDF, { Font } from '@react-pdf/renderer'
import dotenv from 'dotenv'
import { errAsync, Queue, ResultAsync } from '@core/utils'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { IllegalProjectStateError } from '@modules/project/errors'
import { OtherError } from '@modules/shared'
import { Certificate, CertificateProps } from './Certificate'
import { makeLaureat } from './components/Laureat'
import { Elimine } from './components/elimine'

dotenv.config()

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: '/fonts/arimo/Arimo-Regular.ttf',
    },
    {
      src: '/fonts/arimo/Arimo-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/arimo/Arimo-Italic.ttf',
      fontStyle: 'italic',
    },
  ],
})

const queue = new Queue()

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

  const certificateProps: CertificateProps = project.isClasse
    ? { project, type: 'laureat', ...makeLaureat(project) }
    : { project, type: 'elimine', content: Elimine({ project }) }

  const certificate = Certificate(certificateProps)
  const ticket = queue.push(() => ReactPDF.renderToStream(certificate))

  return ResultAsync.fromPromise(ticket, (e: any) => new OtherError(e.message))
}

export { makeCertificate }

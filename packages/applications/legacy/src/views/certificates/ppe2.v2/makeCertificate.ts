import ReactPDF, { Font } from '@react-pdf/renderer';
import dotenv from 'dotenv';
import { errAsync, Queue, ResultAsync } from '../../../core/utils';
import { ProjectDataForCertificate } from '../../../modules/project/dtos';
import { IllegalProjectStateError } from '../../../modules/project/errors';
import { OtherError } from '../../../modules/shared';
import { Certificate } from './Certificate';
import { Laureat } from './components/Laureat';
import { Elimine } from './components/elimine';
import { Validateur } from '@potentiel-domain/appel-offre';

dotenv.config();

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Regular.ttf',
    },
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Italic.ttf',
      fontStyle: 'italic',
    },
  ],
});

const queue = new Queue();

const makeCertificate = (
  project: ProjectDataForCertificate,
  validateur: Validateur,
): ResultAsync<NodeJS.ReadableStream, IllegalProjectStateError | OtherError> => {
  const { appelOffre } = project;
  const { periode } = appelOffre || {};

  if (!appelOffre || !periode) {
    return errAsync(
      new IllegalProjectStateError({ appelOffre: 'appelOffre et/ou periode manquantes' }),
    );
  }

  const certificate = Certificate({
    content: project.isClasse ? Laureat({ project }) : Elimine({ project }),
    project,
    validateur,
  });
  const ticket = queue.push(() => ReactPDF.renderToStream(certificate));

  return ResultAsync.fromPromise(ticket, (e: any) => new OtherError(e.message));
};

export { makeCertificate };

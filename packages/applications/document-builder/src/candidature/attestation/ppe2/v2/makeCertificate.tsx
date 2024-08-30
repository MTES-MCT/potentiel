import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Certificate } from '../components/Certificate';
import { AttestationCandidatureOptions } from '../../AttestationCandidatureOptions';

import { Header } from './Header';
import { Lauréat } from './Laureat';
import { Elimine } from './Elimine';
import { Introduction } from './Introduction';

const makeCertificate = (
  project: AttestationCandidatureOptions,
  validateur: AppelOffre.Validateur,
  imagesRootPath: string,
): React.JSX.Element => {
  return (
    <Certificate
      project={project}
      validateur={validateur}
      header={<Header project={project} imagesRootPath={imagesRootPath} />}
      introduction={<Introduction project={project} />}
    >
      {project.isClasse ? <Lauréat project={project} /> : <Elimine project={project} />}
    </Certificate>
  );
};

export { makeCertificate };

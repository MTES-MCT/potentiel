import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Certificate } from '../Certificate';
import { AttestationCandidatureOptions } from '../AttestationCandidatureOptions';

import { Lauréat } from './Laureat';
import { Elimine } from './Elimine';

const makeCertificate = (
  project: AttestationCandidatureOptions,
  validateur: AppelOffre.Validateur,
): React.JSX.Element => {
  return (
    <Certificate project={project} validateur={validateur}>
      {project.isClasse ? <Lauréat project={project} /> : <Elimine project={project} />}
    </Certificate>
  );
};

export { makeCertificate };

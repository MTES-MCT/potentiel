import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Certificate } from '../Certificate';
import { AttestationCandidatureOptions } from '../AttestationCandidatureOptions';

import { buildLauréat } from './Laureat';
import { buildElimine } from './Elimine';

const makeCertificate = (
  project: AttestationCandidatureOptions,
  validateur: AppelOffre.Validateur,
): React.JSX.Element => {
  const { content, footnotes } = project.isClasse
    ? buildLauréat({ project })
    : buildElimine({ project });

  return (
    <Certificate project={project} validateur={validateur} footnotes={footnotes}>
      {content}
    </Certificate>
  );
};

export { makeCertificate };

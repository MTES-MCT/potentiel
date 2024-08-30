import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Certificate } from '../components/Certificate';
import { Footnotes } from '../components/Footnotes';
import { AttestationCandidatureOptions } from '../../AttestationCandidatureOptions';

import { Header } from './Header';
import { buildLauréat } from './Laureat';
import { buildElimine } from './Elimine';
import { Introduction } from './Introduction';

const makeCertificate = (
  project: AttestationCandidatureOptions,
  validateur: AppelOffre.Validateur,
  imagesRootPath: string,
): React.JSX.Element => {
  const { content, footnotes } = project.isClasse
    ? buildLauréat({ project })
    : buildElimine({ project });

  return (
    <Certificate
      project={project}
      validateur={validateur}
      footnotes={footnotes?.length ? <Footnotes footnotes={footnotes} /> : undefined}
      header={<Header project={project} imagesRootPath={imagesRootPath} />}
      introduction={<Introduction project={project} />}
    >
      {content}
    </Certificate>
  );
};

export { makeCertificate };

import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Certificate } from '../components/Certificate';
import { Footnotes } from '../components/Footnotes';
import { AttestationCandidatureOptions } from '../../AttestationCandidatureOptions';
import { Objet } from '../components/Objet';
import { Signature } from '../components/Signature';

import { Header } from './Header';
import { buildLauréat } from './Laureat';
import { buildElimine } from './Elimine';
import { Introduction } from './Introduction';

const makeCertificate = (
  project: AttestationCandidatureOptions,
  validateur: AppelOffre.Validateur,
  imagesRootPath: string,
): React.JSX.Element => {
  const { content, footnotes, objet } = project.isClasse
    ? buildLauréat({ project })
    : buildElimine({ project });

  return (
    <Certificate
      header={<Header project={project} imagesRootPath={imagesRootPath} />}
      objet={<Objet text={objet} />}
      introduction={<Introduction project={project} />}
      content={content}
      signature={<Signature validateur={validateur} />}
      footnotes={footnotes?.length ? <Footnotes footnotes={footnotes} /> : undefined}
    />
  );
};

export { makeCertificate };

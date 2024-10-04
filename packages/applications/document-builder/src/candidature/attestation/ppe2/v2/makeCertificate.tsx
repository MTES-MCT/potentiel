import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Certificate } from '../components/Certificate';
import { AttestationPPE2V2Options } from '../../AttestationCandidatureOptions';
import { Objet } from '../components/Objet';
import { Signature } from '../components/Signature';

import { Header } from './Header';
import { buildLauréat } from './Laureat';
import { buildElimine } from './Elimine';
import { Introduction } from './Introduction';
import { Logo } from './Logo/index';

const makeCertificate = (
  project: AttestationPPE2V2Options,
  validateur: AppelOffre.Validateur,
  imagesRootPath: string,
): React.JSX.Element => {
  const { content, objet } = project.isClasse
    ? buildLauréat({ project })
    : buildElimine({ project });

  return (
    <Certificate
      header={
        <Header
          project={project}
          logo={<Logo nom={project.ministère} imagesRootPath={imagesRootPath} />}
        />
      }
      objet={<Objet text={objet} />}
      introduction={<Introduction project={project} />}
      content={content}
      signature={<Signature validateur={validateur} />}
    />
  );
};

export { makeCertificate };

import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { CahierDesCharges } from '@potentiel-domain/projet';

import { Certificate } from '../components/Certificate.js';
import { AttestationPPE2V2Options } from '../../AttestationCandidatureOptions.js';
import { Objet } from '../components/Objet.js';
import { Signature } from '../components/Signature.js';

import { Header } from './Header.js';
import { buildLauréat } from './Laureat.js';
import { buildElimine } from './Elimine.js';
import { Introduction } from './Introduction.js';
import { Logo } from './Logo/index.js';

const makeCertificate = (
  project: AttestationPPE2V2Options,
  validateur: AppelOffre.Validateur,
  imagesRootPath: string,
): React.JSX.Element => {
  const cahierDesCharges = CahierDesCharges.bind({
    ...project,
    // pas de CDC modificatif possible à la désignation
    cahierDesChargesModificatif: undefined,
  });
  const { content, objet } = project.isClasse
    ? buildLauréat({ project, cahierDesCharges })
    : buildElimine({ project });

  return (
    <Certificate
      header={
        <Header
          project={project}
          logo={<Logo nom={project.logo} imagesRootPath={imagesRootPath} />}
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

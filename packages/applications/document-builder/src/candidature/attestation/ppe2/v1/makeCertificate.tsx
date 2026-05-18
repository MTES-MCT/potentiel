import type React from 'react';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { CahierDesCharges } from '@potentiel-domain/projet';

import type { AttestationPPE2Options } from '../../AttestationCandidatureOptions.js';
import { Certificate } from '../components/Certificate.js';
import { Footnotes } from '../components/Footnotes.js';
import { Objet } from '../components/Objet.js';
import { Signature } from '../components/Signature.js';
import { buildElimine } from './Elimine.js';
import { Header } from './Header.js';
import { Introduction } from './Introduction.js';
import { buildLauréat } from './Laureat.js';

const makeCertificate = (
  project: AttestationPPE2Options,
  validateur: AppelOffre.Validateur,
  imagesRootPath: string,
): React.JSX.Element => {
  const cahierDesCharges = CahierDesCharges.bind({
    ...project,
    // pas de CDC modificatif possible à la désignation
    cahierDesChargesModificatif: undefined,
  });
  const { content, footnotes, objet } = project.isClasse
    ? buildLauréat({ project, cahierDesCharges })
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

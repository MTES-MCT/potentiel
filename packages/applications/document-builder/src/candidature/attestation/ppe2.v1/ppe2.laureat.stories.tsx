import React from 'react';
import { Font, PDFViewer } from '@react-pdf/renderer';

// eslint-disable-next-line no-restricted-imports
import {
  autoconsommationMetropolePPE2,
  batimentPPE2,
  eolienPPE2,
  innovationPPE2,
  neutrePPE2,
  solPPE2,
} from '@potentiel-domain/inmemory-referential/src/appelOffre/PPE2';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationCandidatureOptions } from '../AttestationCandidatureOptions';
import { Certificate } from '../Certificate';

import { buildLauréat } from './Laureat';

export default { title: 'Attestations PDF/PPE2/v1' };

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
});

const fakeProject: AttestationCandidatureOptions = {
  appelOffre: {} as AppelOffre.AppelOffreReadModel,
  période: {} as AppelOffre.Periode,
  famille: { id: 'famille' } as AppelOffre.Famille,
  isClasse: true,
  prixReference: 42,
  evaluationCarbone: 42,
  isFinancementParticipatif: false,
  isInvestissementParticipatif: false,
  engagementFournitureDePuissanceAlaPointe: true,
  motifsElimination: 'motifsElimination',
  note: 42,
  notifiedOn: 42,
  nomRepresentantLegal: 'nomRepresentantLegal',
  nomCandidat: 'nomCandidat',
  email: 'email',
  nomProjet: 'nomProjet',
  adresseProjet: 'adresseProjet',
  codePostalProjet: 'codePostalProjet',
  communeProjet: 'communeProjet',
  puissance: 42,
  potentielId: 'potentielId',
  territoireProjet: 'territoireProjet',
  technologie: 'pv',
};

const validateur = {
  fullName: 'Nom du signataire',
  fonction: 'fonction du signataire',
} as AppelOffre.Validateur;

export const LaureatPPE2AutoconsommationMétropoleFinancementCollectif = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    actionnariat: 'financement-collectif',
    appelOffre: autoconsommationMetropolePPE2,
    période: autoconsommationMetropolePPE2.periodes[0],
  };
  const { content } = buildLauréat({ project });
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate project={project} validateur={validateur}>
        {content}
      </Certificate>
    </PDFViewer>
  );
};

export const LaureatPPE2BatimentGouvernancePartagee = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    actionnariat: 'gouvernance-partagee',
    appelOffre: batimentPPE2,
    période: batimentPPE2.periodes[0],
  };
  const { content } = buildLauréat({ project });
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate project={project} validateur={validateur}>
        {content}
      </Certificate>
    </PDFViewer>
  );
};

export const LaureatPPE2Eolien = () => {
  const project = {
    ...fakeProject,
    appelOffre: eolienPPE2,
    période: eolienPPE2.periodes[0],
  };
  const { content } = buildLauréat({ project });
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate project={project} validateur={validateur}>
        {content}
      </Certificate>
    </PDFViewer>
  );
};

export const LaureatPPE2Innovation = () => {
  const project = {
    ...fakeProject,
    appelOffre: innovationPPE2,
    période: innovationPPE2.periodes[0],
  };
  const { content } = buildLauréat({ project });
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate project={project} validateur={validateur}>
        {content}
      </Certificate>
    </PDFViewer>
  );
};

export const LaureatPPE2Neutre = () => {
  const project = {
    ...fakeProject,
    appelOffre: neutrePPE2,
    période: neutrePPE2.periodes[0],
  };
  const { content } = buildLauréat({ project });
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate project={project} validateur={validateur}>
        {content}
      </Certificate>
    </PDFViewer>
  );
};

export const LaureatPPE2Sol = () => {
  const project = {
    ...fakeProject,
    appelOffre: solPPE2,
    période: solPPE2.periodes[0],
  };
  const { content } = buildLauréat({ project });
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate project={project} validateur={validateur}>
        {content}
      </Certificate>
    </PDFViewer>
  );
};

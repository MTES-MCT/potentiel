import React from 'react';

// eslint-disable-next-line no-restricted-imports
import {
  batimentPPE2,
  eolienPPE2,
} from '@potentiel-domain/inmemory-referential/src/appelOffre/PPE2';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationCandidatureOptions } from '../AttestationCandidatureOptions';
import { Certificate } from '../Certificate';

import { buildElimine } from './Elimine';

export default { title: 'Attestations PDF/PPE2/v1' };

const fakeProject: AttestationCandidatureOptions = {
  appelOffre: eolienPPE2,
  période: eolienPPE2.periodes[0],
  isClasse: true,
  famille: eolienPPE2.periodes[0].familles[0],
  prixReference: 42,
  evaluationCarbone: 42,
  isFinancementParticipatif: true,
  isInvestissementParticipatif: true,
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
  technologie: 'N/A',
};

const validateur = {
  fullName: 'Nom du signataire',
  fonction: 'fonction du signataire',
} as AppelOffre.Validateur;

export const EliminePPE2AuDessusDePcible = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Au-dessus de Pcible',
  };
  const { content } = buildElimine({ project });
  return (
    <Certificate project={project} validateur={validateur}>
      {content}
    </Certificate>
  );
};

export const EliminePPE2DéjàLauréatNonInstruit = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Déjà lauréat - Non instruit',
  };
  const { content } = buildElimine({ project });
  return (
    <Certificate project={project} validateur={validateur}>
      {content}
    </Certificate>
  );
};

export const EliminePPE2CompetitiviteBatimentPuissanceInferieureVolumeReserves = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: '20% compétitivité',
    puissance: 0.5,
    appelOffre: batimentPPE2,
    période: {
      ...batimentPPE2.periodes[0],
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 99,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 89,
        },
      },
    } as AppelOffre.Periode,
  };
  const { content } = buildElimine({ project });
  return (
    <Certificate project={project} validateur={validateur}>
      {content}
    </Certificate>
  );
};

export const EliminePPE2CompetitiviteBatimentPuissanceSuperieureVolumeReserves = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: '20% compétitivité',
    puissance: 3,
    appelOffre: batimentPPE2,
    période: {
      ...batimentPPE2.periodes[0],
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 99,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 89,
        },
      },
    } as AppelOffre.Periode,
  };
  const { content } = buildElimine({ project });
  return (
    <Certificate project={project} validateur={validateur}>
      {content}
    </Certificate>
  );
};

export const EliminePPE2AutreMotif = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Autre motif',
  };
  const { content } = buildElimine({ project });
  return (
    <Certificate project={project} validateur={validateur}>
      {content}
    </Certificate>
  );
};

export const EliminePPE2AutreMotifNonSoumisAuxGF = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Autre motif',
    appelOffre: {
      ...fakeProject.appelOffre,
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
  };
  const { content } = buildElimine({ project });
  return (
    <Certificate project={project} validateur={validateur}>
      {content}
    </Certificate>
  );
};

import React, { FC } from 'react';

import { DossierRaccordementReadModel } from '@potentiel/domain';
import { userIs } from '@modules/users';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';

import { Separateur } from './Separateur';
import { ÉtapeDemandeComplèteRaccordement } from './ÉtapeDemandeComplèteRaccordement';
import { ÉtapePropositionTechniqueEtFinancière } from './ÉtapePropositionTechniqueEtFinancière';
import { ÉtapeMiseEnService } from './ÉtapeMiseEnService';

export type Dossier = DossierRaccordementReadModel & {
  hasPTFFile: boolean;
  hasDCRFile: boolean;
};

export const Dossier: FC<{
  user: UtilisateurReadModel;
  identifiantProjet: string;
  dossier: Dossier;
}> = ({
  user,
  identifiantProjet,
  dossier: {
    référence,
    dateQualification,
    propositionTechniqueEtFinancière,
    dateMiseEnService,
    hasDCRFile,
    hasPTFFile,
  },
}) => (
  <div className="flex flex-col md:flex-row justify-items-stretch">
    <ÉtapeDemandeComplèteRaccordement
      identifiantProjet={identifiantProjet}
      dateQualification={dateQualification}
      référence={référence}
      hasDCRFile={hasDCRFile}
      showEditLink={userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user)}
    />

    <Separateur />

    <ÉtapePropositionTechniqueEtFinancière
      identifiantProjet={identifiantProjet}
      référence={référence}
      propositionTechniqueEtFinancière={propositionTechniqueEtFinancière}
      hasPTFFile={hasPTFFile}
      showEditLink={userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user)}
    />

    <Separateur />

    <ÉtapeMiseEnService
      identifiantProjet={identifiantProjet}
      référence={référence}
      dateMiseEnService={dateMiseEnService}
      showEditLink={userIs(['admin', 'dgec-validateur'])(user)}
    />
  </div>
);

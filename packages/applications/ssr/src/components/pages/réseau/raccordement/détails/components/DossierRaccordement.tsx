import { FC } from 'react';

import { FormattedForPageDate } from '@/utils/displayDate';

import { Separateur } from './Separateur';
import { ÉtapeDemandeComplèteRaccordement } from './ÉtapeDemandeComplèteRaccordement';
import { ÉtapeMiseEnService } from './ÉtapeMiseEnService';
import { ÉtapePropositionTechniqueEtFinancière } from './ÉtapePropositionTechniqueEtFinancière';

export type DossierRaccordementProps = {
  identifiantProjet: string;
  référence: string;
  demandeComplèteRaccordement: {
    dateQualification?: FormattedForPageDate;
    accuséRéception?: string;
    canEdit: boolean;
  };
  propositionTechniqueEtFinancière: {
    dateSignature?: FormattedForPageDate;
    propositionTechniqueEtFinancièreSignée?: string;
    canEdit: boolean;
  };
  miseEnService: {
    dateMiseEnService?: FormattedForPageDate;
    canEdit: boolean;
  };
};

export const DossierRaccordement: FC<DossierRaccordementProps> = ({
  identifiantProjet,
  référence,
  demandeComplèteRaccordement,
  propositionTechniqueEtFinancière,
  miseEnService,
}) => (
  <div className="flex flex-col md:flex-row justify-items-stretch">
    <ÉtapeDemandeComplèteRaccordement
      identifiantProjet={identifiantProjet}
      référence={référence}
      dateQualification={demandeComplèteRaccordement.dateQualification}
      accuséRéception={demandeComplèteRaccordement.accuséRéception}
      canEdit={demandeComplèteRaccordement.canEdit}
    />

    <Separateur />

    <ÉtapePropositionTechniqueEtFinancière
      identifiantProjet={identifiantProjet}
      référence={référence}
      dateSignature={propositionTechniqueEtFinancière.dateSignature}
      propositionTechniqueEtFinancièreSignée={
        propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée
      }
      canEdit={propositionTechniqueEtFinancière.canEdit}
    />

    <Separateur />

    <ÉtapeMiseEnService
      identifiantProjet={identifiantProjet}
      référence={référence}
      dateMiseEnService={miseEnService.dateMiseEnService}
      canEdit={miseEnService.canEdit}
    />
  </div>
);

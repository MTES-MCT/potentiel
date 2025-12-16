import Notice from '@codegouvfr/react-dsfr/Notice';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { DateTime } from '@potentiel-domain/common';
import { ChampObligatoireAvecAction } from '../../../_helpers/types';

export type RaccordementDétailsProps = {
  raccordement: ChampObligatoireAvecAction<{
    nombreDeDossiers: number;
    gestionnaireDeRéseau: string;
    dateMiseEnService?: DateTime.ValueType;
    aTransmisAccuséRéceptionDemandeRaccordement?: boolean;
  }>;
  alertes: Array<{
    label: string;
  }>;
};

export const RaccordementDétails = async ({ raccordement, alertes }: RaccordementDétailsProps) => (
  <>
    <div>
      <span className="mb-0">Gestionnaire de réseau</span> :{' '}
      {raccordement.value.gestionnaireDeRéseau}{' '}
    </div>
    <div className="mb-0">
      {raccordement.value.nombreDeDossiers === 0
        ? 'Aucun dossier de raccordement renseigné'
        : raccordement.value.nombreDeDossiers === 1
          ? 'Un dossier de raccordement renseigné'
          : `${raccordement.value.nombreDeDossiers} dossiers de raccordement renseignés`}
    </div>
    {alertes.map(({ label }, index) => (
      <Notice description={label} title="" severity="info" key={label + index} />
    ))}
    {raccordement.action && (
      <TertiaryLink href={raccordement.action.url}>{raccordement.action.label}</TertiaryLink>
    )}
  </>
);

import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';

import { Icon } from '@/components/atoms/Icon';

import { ProjetBannerProps } from '../../../../../molecules/projet/ProjetBanner';
import { GestionnaireRéseau as GestionnaireRéseauProps } from '../type';

type ModifierGestionnaireRéseauDuRaccordementProps = {
  gestionnaireRéseau: GestionnaireRéseauProps;
  identifiantProjet: ProjetBannerProps['identifiantProjet'];
  isGestionnaireInconnu?: boolean;
};

export const ModifierGestionnaireRéseauDuRaccordement: FC<
  ModifierGestionnaireRéseauDuRaccordementProps
> = ({
  gestionnaireRéseau,
  identifiantProjet,
  isGestionnaireInconnu,
}: ModifierGestionnaireRéseauDuRaccordementProps) => {
  const lienModifier = gestionnaireRéseau.canEdit ? (
    <a
      className="ml-1"
      href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet)}
      aria-label={`Modifier le gestionnaire (actuel : ${gestionnaireRéseau.raisonSociale})`}
    >
      <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
      Modifier
    </a>
  ) : undefined;

  if (isGestionnaireInconnu) {
    return (
      <Alert
        severity="warning"
        title="Gestionnaire de réseau inconnu"
        className="mb-6"
        description={
          <div className="flex flex-col">
            Vous devez spécifier un gestionnaire de réseau
            {lienModifier && <div>{lienModifier}</div>}
          </div>
        }
      />
    );
  }

  return (
    <div className="mt-2 mb-4 p-0">
      <div>
        Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}{' '}
        {lienModifier && <>({lienModifier})</>}
      </div>
      {gestionnaireRéseau.contactEmail && (
        <div>
          Contact :{' '}
          <a href={`mailto:${gestionnaireRéseau.contactEmail}`} target="_blank">
            {gestionnaireRéseau.contactEmail}
          </a>
        </div>
      )}
    </div>
  );
};

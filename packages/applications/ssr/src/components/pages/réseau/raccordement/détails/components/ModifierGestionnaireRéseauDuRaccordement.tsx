import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Icon } from '@/components/atoms/Icon';

import { ProjetBannerProps } from '../../../../../molecules/projet/ProjetBanner';
import { GestionnaireRéseau } from '../type';

type ModifierGestionnaireRéseauDuRaccordementProps = {
  gestionnaireRéseau: GestionnaireRéseau;
  identifiantProjet: ProjetBannerProps['identifiantProjet'];
};

export const ModifierGestionnaireRéseauDuRaccordement: FC<
  ModifierGestionnaireRéseauDuRaccordementProps
> = ({ gestionnaireRéseau, identifiantProjet }: ModifierGestionnaireRéseauDuRaccordementProps) => {
  return (
    <div className="mt-2 mb-4 p-0">
      <div>
        Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}{' '}
        {gestionnaireRéseau.canEdit && (
          <a
            className="ml-1"
            href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet)}
            aria-label={`Modifier le gestionnaire (actuel : ${gestionnaireRéseau.raisonSociale})`}
          >
            (<Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
            Modifier)
          </a>
        )}
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

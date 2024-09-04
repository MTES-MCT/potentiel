import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { Icon } from '@/components/atoms/Icon';
import { CopyButton } from '@/components/molecules/CopyButton';

import { ProjetBannerProps } from '../../../../../molecules/projet/ProjetBanner';
import { GestionnaireRéseau as GestionnaireRéseauProps } from '../type';

type ModifierGestionnaireRéseauDuRaccordementProps = {
  gestionnaireRéseau: GestionnaireRéseauProps;
  identifiantProjet: ProjetBannerProps['identifiantProjet'];
};

export const ModifierGestionnaireRéseauDuRaccordement: FC<
  ModifierGestionnaireRéseauDuRaccordementProps
> = ({ gestionnaireRéseau, identifiantProjet }: ModifierGestionnaireRéseauDuRaccordementProps) => {
  const isGestionnaireInconnu = gestionnaireRéseau
    ? GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        gestionnaireRéseau.identifiantGestionnaireRéseau,
      ).estÉgaleÀ(GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu)
    : false;

  if (isGestionnaireInconnu) {
    const lienAjout = (
      <Link
        className="ml-1"
        href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet)}
        aria-label="Ajouter un gestionnaire"
      >
        <Icon id="fr-icon-add-circle-line" size="xs" className="mr-1" />
        Spécifier un gestionnaire de réseau
      </Link>
    );

    return (
      <Alert
        severity="warning"
        title="Gestionnaire de réseau inconnu"
        className="mb-6"
        description={
          gestionnaireRéseau.canEdit && (
            <div className="flex flex-row">
              <div>{lienAjout}</div>
            </div>
          )
        }
      />
    );
  }

  const lienModifier = (
    <Link
      className="ml-1"
      href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet)}
      aria-label={`Modifier le gestionnaire actuel (${gestionnaireRéseau.raisonSociale})`}
    >
      <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
      Modifier
    </Link>
  );

  return (
    <div className="mt-2 mb-4 p-0">
      <div>
        Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}{' '}
        {gestionnaireRéseau.canEdit && <>({lienModifier})</>}
      </div>
      {gestionnaireRéseau.contactEmail && (
        <div className="flex items-center gap-2 mt-2">
          Contact : <CopyButton textToCopy={gestionnaireRéseau.contactEmail} />
        </div>
      )}
    </div>
  );
};

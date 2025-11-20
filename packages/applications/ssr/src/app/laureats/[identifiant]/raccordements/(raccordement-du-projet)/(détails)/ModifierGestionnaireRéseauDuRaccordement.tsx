import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { Icon } from '@/components/atoms/Icon';
import { CopyButton } from '@/components/molecules/CopyButton';

type ModifierGestionnaireRéseauDuRaccordementProps = {
  gestionnaireRéseau: PlainType<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>;
  identifiantProjet: string;
  actions: { modifier: boolean };
};

export const ModifierGestionnaireRéseauDuRaccordement: FC<
  ModifierGestionnaireRéseauDuRaccordementProps
> = ({
  gestionnaireRéseau,
  identifiantProjet,
  actions,
}: ModifierGestionnaireRéseauDuRaccordementProps) => {
  const isGestionnaireInconnu = gestionnaireRéseau
    ? GestionnaireRéseau.IdentifiantGestionnaireRéseau.bind(
        gestionnaireRéseau.identifiantGestionnaireRéseau,
      ).estInconnu()
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
          actions.modifier && (
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
        {actions.modifier && <>({lienModifier})</>}
      </div>
      {Option.isSome(gestionnaireRéseau.contactEmail) && (
        <div className="flex items-center gap-2 mt-2">
          Contact : <CopyButton textToCopy={gestionnaireRéseau.contactEmail.email} />
        </div>
      )}
    </div>
  );
};

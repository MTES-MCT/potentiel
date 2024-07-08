'use client';

import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { GestionnaireRéseauSelect } from './GestionnaireRéseauSelect';
import { modifierGestionnaireRéseauRaccordementAction } from './modifierGestionnaireRéseauRaccordement.action';
import { ModifierGestionnaireRéseauRaccordementPageProps } from './ModifierGestionnaireRéseauRaccordement.page';

type ModifierGestionnaireRéseauRaccordementFormProps =
  ModifierGestionnaireRéseauRaccordementPageProps;

export const ModifierGestionnaireRéseauRaccordementForm: FC<
  ModifierGestionnaireRéseauRaccordementFormProps
> = ({ listeGestionnairesRéseau, identifiantGestionnaireRéseauActuel, identifiantProjet }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const gestionnaireActuel = listeGestionnairesRéseau.find(
    (gestionnaire) =>
      gestionnaire.identifiantGestionnaireRéseau === identifiantGestionnaireRéseauActuel,
  );

  return (
    <Form
      action={modifierGestionnaireRéseauRaccordementAction}
      method="post"
      onSuccess={() => router.push(Routes.Raccordement.détail(identifiantProjet))}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      heading="Modifier le gestionnaire de réseau du projet"
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <div className="flex flex-col gap-5">
        <div>
          <GestionnaireRéseauSelect
            id="identifiantGestionnaireReseau"
            name="identifiantGestionnaireReseau"
            state={validationErrors.includes('identifiantGestionnaireReseau') ? 'error' : 'default'}
            stateRelatedMessage="Gestionnaire réseau à préciser"
            gestionnairesRéseau={listeGestionnairesRéseau}
            identifiantGestionnaireRéseauActuel={gestionnaireActuel?.identifiantGestionnaireRéseau}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 m-auto">
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Raccordement.détail(identifiantProjet),
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour aux dossiers de raccordement
          </Button>
          <SubmitButton>Modifier</SubmitButton>
        </div>
      </div>
    </Form>
  );
};

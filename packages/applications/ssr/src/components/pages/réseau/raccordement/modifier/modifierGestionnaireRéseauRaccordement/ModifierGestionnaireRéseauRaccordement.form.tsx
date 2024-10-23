'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from './GestionnaireRéseauSelect';
import {
  modifierGestionnaireRéseauRaccordementAction,
  ModifierGestionnaireRéseauRaccordementFormKeys,
} from './modifierGestionnaireRéseauRaccordement.action';

export type ModifierGestionnaireRéseauRaccordementFormProps = {
  identifiantProjet: string;
  identifiantGestionnaireRéseauActuel: string;
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['listeGestionnairesRéseau'];
};

export const ModifierGestionnaireRéseauRaccordementForm: FC<
  ModifierGestionnaireRéseauRaccordementFormProps
> = ({ listeGestionnairesRéseau, identifiantGestionnaireRéseauActuel, identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierGestionnaireRéseauRaccordementFormKeys>
  >({});

  return (
    <Form
      action={modifierGestionnaireRéseauRaccordementAction}
      method="POST"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      heading="Modifier le gestionnaire de réseau du projet"
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Raccordement.détail(identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour aux dossiers de raccordement
          </Button>
          <SubmitButton>Modifier</SubmitButton>
        </>
      }
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <div className="flex flex-col gap-5">
        <div>
          <GestionnaireRéseauSelect
            id="identifiantGestionnaireReseau"
            name="identifiantGestionnaireReseau"
            state={validationErrors['identifiantGestionnaireReseau'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['identifiantGestionnaireReseau']}
            listeGestionnairesRéseau={listeGestionnairesRéseau}
            identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
          />
        </div>
      </div>
    </Form>
  );
};

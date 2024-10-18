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
} from '../../modifier/modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';

import {
  attribuerGestionnaireRéseauRaccordementAction,
  AttribuerGestionnaireRéseauRaccordementFormKeys,
} from './attribuerGestionnaireRéseauRaccordement.action';

export type AttribuerGestionnaireRéseauRaccordementFormProps = {
  identifiantProjet: string;
  identifiantGestionnaireRéseauActuel: string;
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['gestionnairesRéseau'];
};

export const AttribuerGestionnaireRéseauRaccordementForm: FC<
  AttribuerGestionnaireRéseauRaccordementFormProps
> = ({ listeGestionnairesRéseau, identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AttribuerGestionnaireRéseauRaccordementFormKeys>
  >({});

  return (
    <Form
      action={attribuerGestionnaireRéseauRaccordementAction}
      method="POST"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      heading="Attribuer le gestionnaire de réseau du projet"
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
          <SubmitButton>Attribuer</SubmitButton>
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
            gestionnairesRéseau={listeGestionnairesRéseau}
            identifiantGestionnaireRéseauActuel={undefined}
          />
        </div>
      </div>
    </Form>
  );
};

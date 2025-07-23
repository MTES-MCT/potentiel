'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../GestionnaireRéseauSelect';

import {
  modifierGestionnaireRéseauRaccordementAction,
  ModifierGestionnaireRéseauRaccordementFormKeys,
} from './modifierGestionnaireRéseauRaccordement.action';

export type ModifierGestionnaireRéseauRaccordementFormProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  gestionnaireRéseauActuel: GestionnaireRéseauSelectProps['gestionnaireRéseauActuel'];
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['listeGestionnairesRéseau'];
};

export const ModifierGestionnaireRéseauRaccordementForm: FC<
  ModifierGestionnaireRéseauRaccordementFormProps
> = ({ listeGestionnairesRéseau, gestionnaireRéseauActuel, identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierGestionnaireRéseauRaccordementFormKeys>
  >({});

  return (
    <Form
      action={modifierGestionnaireRéseauRaccordementAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      heading="Modifier le gestionnaire de réseau du projet"
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Raccordement.détail(
                IdentifiantProjet.bind(identifiantProjet).formatter(),
              ),
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
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-5">
        <div>
          <GestionnaireRéseauSelect
            id="identifiantGestionnaireReseau"
            name="identifiantGestionnaireReseau"
            state={validationErrors['identifiantGestionnaireReseau'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['identifiantGestionnaireReseau']}
            listeGestionnairesRéseau={listeGestionnairesRéseau}
            gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          />
        </div>
      </div>
    </Form>
  );
};

'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  corrigerRéférenceDossierAction,
  CorrigerRéférenceDossierFormKeys,
} from './corrigerRéférenceDossier.action';

export type CorrigerRéférenceDossierFormProps = {
  identifiantProjet: string;
  dossierRaccordement: PlainType<Lauréat.Raccordement.ConsulterDossierRaccordementReadModel>;
  gestionnaireRéseau: PlainType<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel>;
  lienRetour: string;
};
export const CorrigerRéférenceDossierForm: FC<CorrigerRéférenceDossierFormProps> = ({
  identifiantProjet,
  dossierRaccordement: { référence },
  gestionnaireRéseau,
  lienRetour,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerRéférenceDossierFormKeys>
  >({});

  const { aideSaisieRéférenceDossierRaccordement } = gestionnaireRéseau;

  return (
    <Form
      action={corrigerRéférenceDossierAction}
      heading="Corriger une référence de dossier de raccordement"
      pendingModal={{
        id: 'form-corriger-reference-dossier',
        title: 'Correction en cours',
        children: 'Correction de la référence de dossier de raccordement en cours',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Corriger',
        secondaryAction: {
          type: 'back',
          href: lienRetour,
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={référence.référence} />
      <Input
        label="Référence du dossier de raccordement du projet *"
        hintText={
          <>
            {Option.match(aideSaisieRéférenceDossierRaccordement.format)
              .some((format) => <div className="m-0">Format attendu : {format}</div>)
              .none(() => (
                <></>
              ))}
            {Option.match(aideSaisieRéférenceDossierRaccordement.légende)
              .some((légende) => <div className="m-0 italic">Exemple : {légende}</div>)
              .none(() => (
                <></>
              ))}
          </>
        }
        state={validationErrors['referenceDossierCorrigee'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['referenceDossierCorrigee']}
        nativeInputProps={{
          type: 'text',
          name: 'referenceDossierCorrigee',
          placeholder: Option.match(aideSaisieRéférenceDossierRaccordement.format)
            .some((format) => `Exemple: ${format}`)
            .none(() => `Renseigner l'identifiant`),
          required: true,
          defaultValue: référence.référence,
          pattern:
            aideSaisieRéférenceDossierRaccordement?.expressionReguliere?.expression || undefined,
        }}
      />
    </Form>
  );
};

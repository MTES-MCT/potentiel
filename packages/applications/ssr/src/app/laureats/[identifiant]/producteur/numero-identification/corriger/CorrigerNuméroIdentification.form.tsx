'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { debounce } from '@mui/material/utils';
import { type FC, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type CorrigerNuméroIdentificationFormKeys,
  corrigerNuméroIdentificationAction,
} from './corrigerNuméroIdentification.action';

export type CorrigerNuméroIdentificationFormProps = PlainType<{
  identifiantProjet: IdentifiantProjet.ValueType;
  numéroIdentification?: Lauréat.Producteur.NuméroIdentification.ValueType;
}>;

export const CorrigerNuméroIdentificationForm: FC<CorrigerNuméroIdentificationFormProps> = ({
  identifiantProjet,
  numéroIdentification,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerNuméroIdentificationFormKeys>
  >({});

  const [siretError, setSiretError] = useState<string | null>(null);

  const handleSiretUpdate = async (siret: string) => {
    setSiretError(null);

    if (!siret.replaceAll(/\s/g, '').match(/^\d{14}$/)) {
      setSiretError('Le SIRET doit être constitué de 14 chiffres');
      return;
    }

    const searchParams = new URLSearchParams({ q: siret });
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_ENTREPRISES_API_URL}/search?${searchParams.toString()}`,
    ).then(
      (response) =>
        response.json() as Promise<{
          results: {
            siren: string;
            nom_raison_sociale: string;
            nom_complet: string;
          }[];
        }>,
    );

    if (data.results.length === 0) {
      setSiretError('Aucun producteur trouvé pour ce SIRET');
    }
  };

  const updateDelayed = debounce(handleSiretUpdate, 400);

  return (
    <Form
      action={corrigerNuméroIdentificationAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: numéroIdentification ? 'Corriger' : 'Renseigner',
        secondaryAction: {
          type: 'back',
        },
        submitDisabled: !!siretError,
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
      <Input
        state={siretError || validationErrors['siret'] ? 'error' : 'default'}
        stateRelatedMessage={siretError ?? validationErrors['siret']}
        hintText={`Constitué de 14 chiffres. Précédemment : ${numéroIdentification?.siret ?? 'non renseigné'}`}
        label={'Numéro SIRET'}
        nativeInputProps={{
          name: 'siret',
          defaultValue: numéroIdentification?.siret || '',
          onChange: (e) => updateDelayed(e.target.value),
          required: true,
          'aria-required': true,
        }}
      />

      <Input
        textArea
        label="Raison (optionnel)"
        id="raison"
        hintText="Veuillez détailler les raisons de ce changement"
        nativeTextAreaProps={{ name: 'raison', required: false, 'aria-required': false }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative"
        name="piecesJustificatives"
        hintText="Veuillez joindre vos justificatifs, par exemple un extrait Kbis"
        multiple
        required
        formats={['pdf']}
        state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['piecesJustificatives']}
      />
    </Form>
  );
};

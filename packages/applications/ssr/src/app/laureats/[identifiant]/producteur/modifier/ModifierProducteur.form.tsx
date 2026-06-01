'use client';

import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Input from '@codegouvfr/react-dsfr/Input';
import { type FC, useEffect, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type ModifierProducteurFormKeys,
  modifierProducteurAction,
} from './modifierProducteur.action';

export type ModifierProducteurFormProps =
  PlainType<Lauréat.Producteur.ConsulterProducteurReadModel>;

export const ModifierProducteurForm: FC<ModifierProducteurFormProps> = ({
  identifiantProjet,
  producteur: producteurInitialValue,
  numéroIdentification,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierProducteurFormKeys>
  >({});

  const [producteur, setProducteur] = useState({ value: '', fromAPI: false });
  const [siret, setSiret] = useState('');
  const [siretUnknown, setSiretUnknown] = useState(false);
  const [siretError, setSiretError] = useState<string | null>(null);

  useEffect(() => {
    setSiretError(null);
    if (!siret || siretUnknown) {
      return;
    }

    if (!siret.replaceAll(/\s/g, '').match(/^\d{14}$/)) {
      setSiretError('Le SIRET doit être constitué de 14 chiffres');
      return;
    }

    const updateProducteurInfo = async (siret: string) => {
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
      if (data.results.length === 1) {
        setProducteur({
          value: data.results[0].nom_raison_sociale ?? data.results[0].nom_complet,
          fromAPI: true,
        });
        return;
      } else if (data.results.length === 0) {
        setSiretError('Aucun producteur trouvé pour ce SIRET');
      } else {
        setSiretError('Plusieurs producteurs trouvés pour ce SIRET');
      }
    };

    void updateProducteurInfo(siret);
  }, [siret, siretUnknown]);

  return (
    <Form
      action={modifierProducteurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
      <Checkbox
        options={[
          {
            label: 'Je ne connais pas le SIRET du nouveau producteur',
            nativeInputProps: {
              checked: siretUnknown,
              onChange: (event) => {
                setSiretUnknown(event.target.checked);
                setSiret('');
                setProducteur((p) => ({ value: p.value, fromAPI: false }));
              },
            },
          },
        ]}
      />
      {!siretUnknown && (
        <Input
          state={siretError || validationErrors['siret'] ? 'error' : 'default'}
          stateRelatedMessage={siretError ?? validationErrors['siret']}
          hintText={`Constitué de 14 chiffres. Précédemment : ${numéroIdentification?.siret ?? 'non renseigné'}`}
          label={'Numéro SIRET'}
          nativeInputProps={{
            name: 'siret',
            value: siret,
            onChange: (e) => setSiret(e.target.value),
            required: !siretUnknown,
            'aria-required': !siretUnknown,
          }}
        />
      )}
      <Input
        state={validationErrors['producteur'] ? 'error' : producteur.fromAPI ? 'info' : 'default'}
        stateRelatedMessage={
          validationErrors['producteur'] ??
          (producteur.fromAPI
            ? 'Le nom du producteur est récupéré automatiquement à partir du SIRET'
            : undefined)
        }
        label="Producteur"
        nativeInputProps={{
          name: 'producteur',
          value: producteur.value,
          onChange: (e) => setProducteur({ value: e.target.value, fromAPI: false }),
          required: true,
          'aria-required': true,
        }}
        hintText={`Précédemment : ${producteurInitialValue}`}
      />
      <Input
        textArea
        label="Raison"
        id="raison"
        hintText="Veuillez détailler les raisons de ce changement"
        nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative (optionnel)"
        name="piecesJustificatives"
        hintText="Si pertinent, veuillez joindre vos justificatifs"
        multiple
        formats={['pdf']}
        state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['piecesJustificatives']}
      />
    </Form>
  );
};

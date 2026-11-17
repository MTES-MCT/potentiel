'use client';

import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Input from '@codegouvfr/react-dsfr/Input';
import Notice from '@codegouvfr/react-dsfr/Notice';
import { type FC, useEffect, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type EnregistrerChangementProducteurFormKeys,
  enregistrerChangementProducteurAction,
} from './enregistrerChangementProducteur.action';

export type EnregistrerChangementProducteurFormProps =
  PlainType<Lauréat.Producteur.ConsulterProducteurReadModel>;

export const EnregistrerChangementProducteurForm: FC<EnregistrerChangementProducteurFormProps> = ({
  identifiantProjet,
  producteur: producteurInitialValue,
  numéroIdentification,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerChangementProducteurFormKeys>
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
              nom_raison_sociale?: string;
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
      action={enregistrerChangementProducteurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Confirmer',
        secondaryAction: {
          type: 'back',
        },
      }}
      confirmSubmit={{
        title: 'Confirmer le changement de producteur',
        children: (
          <Notice
            title="Vous êtes sur le point de déclarer ce changement de producteur"
            description={
              <span>
                <span className="mt-2 block">
                  Dès la confirmation, vous perdrez immédiatement vos accès au projet et ne pourrez
                  plus effectuer de modification.
                </span>
                <span>
                  Si des garanties financières sont encore en cours sur ce projet, vous devrez
                  adresser votre demande de mainlevée hors Potentiel directement à votre DREAL.
                </span>
              </span>
            }
          ></Notice>
        ),
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-6">
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
          label="Raison (optionnel)"
          id="raison"
          className="lg:w-1/2"
          hintText="Veuillez détailler les raisons de ce changement"
          nativeTextAreaProps={{
            name: 'raison',
            required: false,
            'aria-required': false,
          }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label={'Pièce justificative'}
          name="piecesJustificatives"
          hintText="Joindre les statuts mis à jour"
          required={true}
          formats={['pdf']}
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};

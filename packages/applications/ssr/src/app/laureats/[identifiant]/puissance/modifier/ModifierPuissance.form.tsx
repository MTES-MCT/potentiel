'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { modifierPuissanceAction, ModifierPuissanceFormKeys } from './modifierPuissance.action';

export type ModifierPuissanceFormProps = PlainType<
  Pick<
    Lauréat.Puissance.ConsulterPuissanceReadModel,
    'identifiantProjet' | 'puissance' | 'unitéPuissance' | 'puissanceDeSite'
  > & {
    infosCahierDesChargesPuissanceDeSite: AppelOffre.ChampsSupplémentairesCandidature['puissanceDeSite'];
  }
>;

export const ModifierPuissanceForm: FC<ModifierPuissanceFormProps> = ({
  identifiantProjet,
  puissance,
  puissanceDeSite,
  unitéPuissance: { unité: unitéPuissance },
  infosCahierDesChargesPuissanceDeSite,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierPuissanceFormKeys>
  >({});

  return (
    <Form
      action={modifierPuissanceAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
        },
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-6">
        <>
          <Input
            state={validationErrors['puissance'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['puissance']}
            label={`Puissance (en ${unitéPuissance})`}
            nativeInputProps={{
              name: 'puissance',
              defaultValue: puissance,
              'aria-required': true,
              required: true,
              type: 'number',
              inputMode: 'decimal',
              pattern: '[0-9]+([.][0-9]+)?',
              step: 'any',
            }}
          />
          {infosCahierDesChargesPuissanceDeSite && (
            <Input
              state={validationErrors['puissanceDeSite'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['puissanceDeSite']}
              label={`Puissance de site (en ${unitéPuissance}) ${infosCahierDesChargesPuissanceDeSite === 'optionnel' ? '(optionnel)' : ''}`}
              nativeInputProps={{
                name: 'puissanceDeSite',
                defaultValue: puissanceDeSite,
                'aria-required': infosCahierDesChargesPuissanceDeSite === 'requis',
                required: infosCahierDesChargesPuissanceDeSite === 'requis',
                type: 'number',
                inputMode: 'decimal',
                pattern: '[0-9]+([.][0-9]+)?',
                step: 'any',
              }}
            />
          )}
        </>

        <Input
          textArea
          label={`Raison`}
          id="raison"
          hintText="Veuillez détailler les raisons ayant conduit au changement de puissance."
          nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />

        <UploadNewOrModifyExistingDocument
          label="Pièce justificative (optionnel)"
          name="piecesJustificatives"
          hintText="Joindre vos justificatifs"
          multiple
          formats={['pdf']}
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};

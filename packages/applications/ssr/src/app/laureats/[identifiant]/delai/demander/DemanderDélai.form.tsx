'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { demanderDélaiAction, DemanderDélaiFormKeys } from './DemanderDélai.action';

export type DemanderDélaiFormProps = {
  identifiantProjet: string;
  dateAchèvementPrévisionnelActuelle: PlainType<Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType>;
};

export const DemanderDélaiForm: FC<DemanderDélaiFormProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelActuelle,
}) => {
  const dateActuelle = Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
    dateAchèvementPrévisionnelActuelle,
  );

  const [nouvelleDate, setNouvelleDate] = useState<DateTime.ValueType>(dateActuelle.dateTime);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors<DemanderDélaiFormKeys>>(
    {},
  );

  const peutDemanderUnDélai = () => nouvelleDate.estUltérieureÀ(dateActuelle.dateTime);

  const ajouterDélaiÀLaDateActuelle = (nombreDeMois: number) => {
    const nouvelleDate = dateActuelle.ajouterDélai(nombreDeMois);

    setNouvelleDate(nouvelleDate.dateTime);
  };

  return (
    <Form
      action={demanderDélaiAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Demander',
        secondaryAction: {
          type: 'back',
          href: Routes.Projet.details(identifiantProjet),
          label: 'Retour à la page projet',
        },
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <div>
        <Input
          label="Durée du délai"
          hintText="Veuillez saisir une durée de délai en mois, avec au minimum 1 mois"
          className="w-full md:w-3/4"
          nativeInputProps={{
            min: '1',
            name: 'nombreDeMois',
            required: true,
            'aria-required': true,
            type: 'number',
            inputMode: 'numeric',
            pattern: '[1-9]*',
            onChange: (e) => ajouterDélaiÀLaDateActuelle(Number(e.target.value)),
          }}
          state={validationErrors['nombreDeMois'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['nombreDeMois']}
        />

        {peutDemanderUnDélai() && (
          <div>
            Après accord de votre demande de délai, la date d'achèvement prévisionnel serait le{' '}
            <FormattedDate date={nouvelleDate.formatter()} className="font-semibold" />
          </div>
        )}
      </div>

      <Input
        textArea
        label="Raison"
        id="raison"
        className="w-full md:w-3/4"
        hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant
                conduit à cette demande de délai."
        nativeTextAreaProps={{
          name: 'raison',
          required: true,
          'aria-required': true,
        }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative"
        name="pieceJustificative"
        formats={['pdf']}
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};

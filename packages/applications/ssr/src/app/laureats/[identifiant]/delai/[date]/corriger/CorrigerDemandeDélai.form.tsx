'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import {
  corrigerDemandeDélaiAction,
  CorrigerDemandeDélaiFormKeys,
} from './corrigerDemandeDélai.action';

export type CorrigerDemandeDélaiFormProps = {
  identifiantProjet: string;
  dateDemande: DateTime.RawType;
  dateAchèvementPrévisionnelActuelle: PlainType<Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType>;
  nombreDeMois: number;
  raison: string;
  pièceJustificative: DocumentProjet.RawType;
};

export const CorrigerDemandeDélaiForm: FC<CorrigerDemandeDélaiFormProps> = ({
  identifiantProjet,
  dateDemande,
  dateAchèvementPrévisionnelActuelle,
  nombreDeMois,
  pièceJustificative,
  raison,
}) => {
  const dateActuelle = Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
    dateAchèvementPrévisionnelActuelle,
  );

  const [nouvelleDate, setNouvelleDate] = useState(dateActuelle.ajouterDélai(nombreDeMois));

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerDemandeDélaiFormKeys>
  >({});

  const peutDemanderUnDélai = () => nouvelleDate.dateTime.estUltérieureÀ(dateActuelle.dateTime);

  const ajouterDélaiÀLaDateActuelle = (nombreDeMois: number) => {
    const nouvelleDate = dateActuelle.ajouterDélai(nombreDeMois);

    setNouvelleDate(nouvelleDate);
  };

  return (
    <Form
      action={corrigerDemandeDélaiAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Corriger la demande',
        back: {
          href: Routes.Délai.détail(identifiantProjet, dateDemande),
          label: 'Retour à la page de la demande',
        },
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <input type={'hidden'} value={dateDemande} name="dateDemande" />

      <div>
        <Input
          label="Durée du délai"
          hintText="Veuillez saisir une durée de délai en mois, avec au minimum 1 mois"
          className="w-full md:w-1/2"
          nativeInputProps={{
            min: '1',
            name: 'nombreDeMois',
            required: true,
            'aria-required': true,
            type: 'number',
            inputMode: 'numeric',
            pattern: '[1-9]*',
            defaultValue: nombreDeMois,
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
        className="w-full md:w-1/2"
        hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant
                conduit à cette demande de délai."
        nativeTextAreaProps={{
          name: 'raison',
          required: true,
          defaultValue: raison,
          'aria-required': true,
        }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative"
        name="pieceJustificative"
        documentKeys={[pièceJustificative]}
        formats={['pdf']}
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};

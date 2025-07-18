'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
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
  dateAchèvementPrévisionnelActuelle: DateTime.RawType;
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
  const dateActuelle = DateTime.convertirEnValueType(dateAchèvementPrévisionnelActuelle);

  const [nouvelleDate, setNouvelleDate] = useState<DateTime.ValueType>(
    dateActuelle.ajouterNombreDeMois(nombreDeMois),
  );

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerDemandeDélaiFormKeys>
  >({});

  const peutDemanderUnDélai = () => nouvelleDate.estUltérieureÀ(dateActuelle);

  const ajouterDélaiÀLaDateActuelle = (nombreDeMois: number) => {
    const nouvelleDate = dateActuelle.ajouterNombreDeMois(nombreDeMois);

    setNouvelleDate(nouvelleDate);
  };

  return (
    <Form
      action={corrigerDemandeDélaiAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Délai.détail(identifiantProjet, dateDemande),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour à la page de la demande
          </Button>
          <SubmitButton>Corriger la demande de délai</SubmitButton>
        </>
      }
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

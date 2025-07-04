'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { demanderDélaiAction, DemanderDélaiFormKeys } from './DemanderDélai.action';

export type DemanderDélaiFormProps = {
  identifiantProjet: string;
  dateAchèvementPrévisionnelleActuelle: DateTime.RawType;
};

export const DemanderDélaiForm: FC<DemanderDélaiFormProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelleActuelle,
}) => {
  const [nouvelleDate, setNouvelleDate] = useState<DateTime.RawType | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors<DemanderDélaiFormKeys>>(
    {},
  );
  return (
    <>
      <Alert
        description={
          <div>
            Date d'achèvement prévisionnelle actuelle :{' '}
            <FormattedDate date={dateAchèvementPrévisionnelleActuelle} className="font-semibold" />
            {nouvelleDate && (
              <div>
                Nouvelle date d'achèvement prévisionnelle :{' '}
                <FormattedDate date={nouvelleDate} className="font-semibold" />
              </div>
            )}
          </div>
        }
        severity="info"
        small
      />
      <Form
        action={demanderDélaiAction}
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
        actions={
          <>
            <Button
              priority="secondary"
              linkProps={{
                href: Routes.Projet.details(identifiantProjet),
                prefetch: false,
              }}
              iconId="fr-icon-arrow-left-line"
            >
              Retour à la page projet
            </Button>
            <SubmitButton>Demander un délai</SubmitButton>
          </>
        }
      >
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
        <input
          type={'hidden'}
          value={dateAchèvementPrévisionnelleActuelle}
          name="dateAchevementPrevisionnelleActuelle"
        />

        <Input
          label="Durée du délai"
          hintText="Veuillez ajouter un nombre de mois"
          nativeInputProps={{
            min: '1',
            name: 'nombreDeMois',
            required: true,
            'aria-required': true,
            type: 'number',
            inputMode: 'numeric',
            pattern: '[0-9]+([.][0-9]+)?',
            step: '1',
            onChange: (e) => {
              const date = DateTime.convertirEnValueType(
                dateAchèvementPrévisionnelleActuelle,
              ).ajouterNombreDeMois(Number(e.target.value));
              setNouvelleDate(date.formatter());
            },
          }}
          state={validationErrors['nombreDeMois'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['nombreDeMois']}
        />

        <Input
          textArea
          label="Raison"
          id="raison"
          hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant
                conduit à cette demande de délai."
          nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
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
    </>
  );
};

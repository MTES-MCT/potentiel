'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { ValidationErrors } from '../../../../utils/formAction';

import {
  demanderChangementActionnaireAction,
  DemanderChangementActionnaireFormKeys,
} from './demanderChangementActionnaire.action';
import { DemanderChangementActionnairePageProps } from './DemanderChangementActionnaire.page';

export type DemanderChangementActionnaireFormProps = DemanderChangementActionnairePageProps;

// TODO: reprendre le wording cf nouveau ticket
export const DemanderChangementActionnaireForm: FC<DemanderChangementActionnaireFormProps> = ({
  identifiantProjet,
  actionnaire,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementActionnaireFormKeys>
  >({});
  const [piècesJustificatives, setPiècesJustificatives] = useState<Array<string>>([]);

  return (
    <Form
      action={demanderChangementActionnaireAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour sur le projet
          </Button>
          <SubmitButton
            disabledCondition={() =>
              !piècesJustificatives.length || Object.keys(validationErrors).length > 0
            }
          >
            Demander le changement de l'actionnaire
          </SubmitButton>
        </>
      }
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-6">
        <Input
          state={validationErrors['actionnaire'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['actionnaire']}
          label="Nouvelle société mère"
          nativeInputProps={{
            name: 'actionnaire',
            defaultValue: actionnaire,
            required: true,
            'aria-required': true,
          }}
        />
        <Input
          textArea
          label="Raison"
          id="raison"
          hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant conduit au changement d'actionnaire."
          nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label={'Pièce justificative'}
          name="piecesJustificatives"
          hintText={
            "Veuillez transmettre vos pièces justificatives justifiant le changement de société mère ou d'actionnariat"
          }
          required
          formats={['pdf']}
          multiple
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
          onChange={(piècesJustificatives) => {
            delete validationErrors['piecesJustificatives'];
            setPiècesJustificatives(piècesJustificatives);
          }}
        />
      </div>
    </Form>
  );
};
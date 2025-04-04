'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  demanderChangementPuissanceAction,
  DemanderChangementPuissanceFormKeys,
} from './demanderChangementPuissance.action';
import { DemanderChangementPuissancePageProps } from './DemanderChangementPuissance.page';

export type DemanderChangementPuissanceFormProps = DemanderChangementPuissancePageProps;

export const DemanderChangementPuissanceForm: FC<DemanderChangementPuissanceFormProps> = ({
  identifiantProjet,
  puissance,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementPuissanceFormKeys>
  >({});
  const [piècesJustificatives, setPiècesJustificatives] = useState<Array<string>>([]);
  const [nouvellePuissance, setNouvellePuissance] = useState<number>(puissance);

  // ce boolean servira à calculter si le ratio dépasse les minima de l'AO
  // à voir si ça render bien dès que le ratio change ou si useeffect
  const ratio = nouvellePuissance / puissance;
  console.log(ratio);
  const isInformationEnregitree = true;

  return (
    <Form
      action={demanderChangementPuissanceAction}
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
            Retour à la page projet
          </Button>
          <SubmitButton
            disabledCondition={() =>
              !piècesJustificatives.length || Object.keys(validationErrors).length > 0
            }
          >
            Confirmer la demande
          </SubmitButton>
        </>
      }
    >
      <input
        name="isInformationEnregitree"
        type="hidden"
        value={isInformationEnregitree ? 'true' : 'false'}
      />

      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-6">
        <Input
          state={validationErrors['puissance'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['puissance']}
          label="Puissance (en MWc)"
          nativeInputProps={{
            name: 'puissance',
            defaultValue: puissance,
            required: true,
            'aria-required': true,
            inputMode: 'decimal',
            pattern: '[0-9]+([.][0-9]+)?',
            step: 'any',
            type: 'number',
            onChange: (e) => setNouvellePuissance(parseFloat(e.target.value)),
          }}
        />
        <Input
          textArea
          label="Raison"
          id="raison"
          hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant conduit au changement de puissance."
          nativeTextAreaProps={{
            name: 'raison',
            required: !isInformationEnregitree,
            'aria-required': true,
          }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label="Pièce(s) justificative(s)"
          name="piecesJustificatives"
          hintText="Joindre votre justificatif"
          required={!isInformationEnregitree}
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

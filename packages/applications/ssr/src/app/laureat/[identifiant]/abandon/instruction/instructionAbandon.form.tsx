'use client';
import { useState } from 'react';
import {
  experimental_useFormState as useFormState,
  //@ts-ignore
  experimental_useFormStatus as useFormStatus,
} from 'react-dom';
import { InstructionAbandonState, instructionAbandonAction } from './instructionAbandon.action';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

const initialState: InstructionAbandonState = {
  error: undefined,
  validationErrors: [],
};

type InstructionAbandonFormProps = {
  abandonDemandé: boolean;
  recandidature: boolean;
  identifiantProjet: string;
};

export const InstructionAbandonForm = ({
  abandonDemandé,
  identifiantProjet,
  recandidature,
}: InstructionAbandonFormProps) => {
  const demandeConfirmationPossible = abandonDemandé && !recandidature;

  const [needToUploadFile, setNeedToUploadFile] = useState(true);
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(instructionAbandonAction, initialState);

  return (
    <>
      <h2>Instruction</h2>
      <form action={formAction}>
        {state.error && <Alert severity="error" title={state.error} />}

        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
        {needToUploadFile && (
          <Upload
            label="Réponse signée"
            hint="au format pdf"
            state={state.validationErrors.includes('reponseSignee') ? 'error' : 'default'}
            stateRelatedMessage="Réponse signée obligatoire"
            nativeInputProps={{
              name: 'reponseSignee',
            }}
          />
        )}

        <RadioButtons
          legend="Instruire l'abandon du projet :"
          options={[
            ...(demandeConfirmationPossible
              ? [
                  {
                    label: 'À confirmer',
                    nativeInputProps: {
                      value: 'demander-confirmation',
                      onClick: () => setNeedToUploadFile(true),
                    },
                  },
                ]
              : []),
            {
              label: 'Accorder',
              nativeInputProps: {
                value: 'accorder',
                onClick: () => setNeedToUploadFile(!recandidature),
              },
            },
            {
              label: 'Rejeter',
              nativeInputProps: {
                value: 'rejeter',
                onClick: () => setNeedToUploadFile(true),
              },
            },
          ]}
        />

        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="left"
          buttons={[
            {
              children: 'Instruire',
              type: 'submit',
              priority: 'primary',
              nativeButtonProps: {
                'aria-disabled': pending,
              },
            },
            {
              children: 'Retour',
              linkProps: {
                href: '/laureat/abandon',
              },
              priority: 'secondary',
            },
          ]}
        />
      </form>
    </>
  );
};

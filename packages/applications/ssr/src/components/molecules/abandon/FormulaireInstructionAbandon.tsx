'use client';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  InstructionAbandonState,
  instructionAbandonAction,
} from '@/app/laureat/[identifiant]/abandon/instruction/instruction.action';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import { Heading2 } from '../../atoms/headings';

const initialState: InstructionAbandonState = {
  error: undefined,
  validationErrors: [],
};

type FormulaireInstructionAbandonProps = {
  statut:
    | 'accordé'
    | 'annulé'
    | 'confirmation-demandée'
    | 'confirmé'
    | 'demandé'
    | 'rejeté'
    | 'inconnu';
  recandidature: boolean;
  identifiantProjet: string;
  utilisateur: {
    rôle:
      | 'admin'
      | 'porteur-projet'
      | 'dreal'
      | 'acheteur-obligé'
      | 'ademe'
      | 'dgec-validateur'
      | 'caisse-des-dépôts'
      | 'cre';
    email: string;
  };
};

export const FormulaireInstructionAbandon = ({
  statut,
  identifiantProjet,
  recandidature,
  utilisateur,
}: FormulaireInstructionAbandonProps) => {
  const réponseAttendue = ['demandé', 'confirmé'].includes(statut);
  {
    /* TODO : l'autorité pour répondre aux demandes par type doit être retournée par la query */
  }
  const réponsePermise =
    utilisateur.rôle === 'dgec-validateur' || (utilisateur.rôle === 'admin' && !recandidature);

  const demandeConfirmationPossible = statut === 'demandé' && !recandidature;

  const [needToUploadFile, setNeedToUploadFile] = useState(true);
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(instructionAbandonAction, initialState);

  return (
    <>
      {réponseAttendue && réponsePermise ? (
        <>
          <Heading2>Instruire la demande</Heading2>
          <form action={formAction} method="post" encType="multipart/form-data">
            {state.error && <Alert severity="error" title={state.error} className="mb-4" />}

            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <input type={'hidden'} value={utilisateur.email} name="utilisateurValue" />

            <RadioButtons
              legend="Instruire l'abandon"
              orientation="horizontal"
              name="instruction"
              options={[
                ...(demandeConfirmationPossible
                  ? [
                      {
                        label: 'demander une confirmation',
                        nativeInputProps: {
                          value: 'demander-confirmation',
                          onClick: () => setNeedToUploadFile(true),
                        },
                      },
                    ]
                  : []),
                {
                  label: 'accorder',
                  nativeInputProps: {
                    value: 'accorder',
                    onClick: () => setNeedToUploadFile(!recandidature),
                  },
                },
                {
                  label: 'rejeter',
                  nativeInputProps: {
                    value: 'rejeter',
                    onClick: () => setNeedToUploadFile(true),
                  },
                },
              ]}
            />

            {needToUploadFile && (
              <Upload
                label="Téléverser une réponse signée"
                hint="au format pdf"
                state={state.validationErrors.includes('reponseSignee') ? 'error' : 'default'}
                stateRelatedMessage="Réponse signée obligatoire"
                nativeInputProps={{
                  name: 'reponseSignee',
                }}
                className="mb-4"
              />
            )}

            <ButtonsGroup
              inlineLayoutWhen="always"
              alignment="left"
              buttons={[
                {
                  children: 'Envoyer',
                  type: 'submit',
                  priority: 'primary',
                  nativeButtonProps: {
                    'aria-disabled': pending,
                  },
                  className: 'bg-blue-france-sun-base text-white',
                },
                {
                  children: 'Retour à la liste',
                  linkProps: {
                    href: '/laureat/abandon/1',
                  },
                  priority: 'secondary',
                },
              ]}
            />
          </form>
        </>
      ) : (
        ''
      )}
    </>
  );
};

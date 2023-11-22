'use client';

import { useState } from 'react';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import { Heading2 } from '../../atoms/headings';
import { StatutAbandonBadge } from './StatutAbandonBadge';
import { Utilisateur } from '@/utils/utilisateur';
import { DemanderConfirmationAbandonForm } from './DemanderConfirmationAbandonForm';

type InstructionAbandonFormProps = {
  statut: Parameters<typeof StatutAbandonBadge>[0]['statut'];
  recandidature: boolean;
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const InstructionAbandonForm = ({
  statut,
  identifiantProjet,
  recandidature,
  utilisateur,
}: InstructionAbandonFormProps) => {
  const réponseAttendue = ['demandé', 'confirmé'].includes(statut);
  {
    /* TODO : l'autorité pour répondre aux demandes par type doit être retournée par la query */
  }
  const réponsePermise =
    utilisateur.rôle === 'dgec-validateur' || (utilisateur.rôle === 'admin' && !recandidature);
  const demandeConfirmationPossible = statut === 'demandé' && !recandidature;

  const [instruction, setInstruction] = useState('demander-confirmation');

  return (
    <>
      {réponseAttendue && réponsePermise ? (
        <>
          <Heading2>Instruire la demande</Heading2>
          <form>
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
                          onClick: () => {
                            setInstruction('demander-confirmation');
                          },
                          checked: true,
                        },
                      },
                    ]
                  : []),
                {
                  label: 'accorder',
                  nativeInputProps: {
                    value: 'accorder',
                    onClick: () => {
                      setInstruction('accorder');
                    },
                    disabled: true,
                  },
                },
                {
                  label: 'rejeter',
                  nativeInputProps: {
                    value: 'rejeter',
                    onClick: () => {
                      setInstruction('rejeter');
                    },
                    disabled: true,
                  },
                },
              ]}
            />
          </form>
          {instruction === 'demander-confirmation' && (
            <DemanderConfirmationAbandonForm
              identifiantProjet={identifiantProjet}
              utilisateur={utilisateur}
            />
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};

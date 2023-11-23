'use client';

import { useState } from 'react';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import { Heading2 } from '../../atoms/headings';
import { StatutAbandonBadge } from './StatutAbandonBadge';
import { Utilisateur } from '@/utils/getUtilisateur';
import { DemanderConfirmationAbandonForm } from './DemanderConfirmationAbandonForm';
import { RejeterAbandonForm } from './RejeterAbandonForm';
import { AccorderAbandonForm } from './AccorderAbandonForm';

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
  const instructionEnCours = !['accordé', 'rejeté'].includes(statut);
  {
    /* TODO : l'autorité pour répondre aux demandes par type doit être retournée par la query */
  }
  const réponsePermise =
    utilisateur.rôle === 'dgec-validateur' || (utilisateur.rôle === 'admin' && !recandidature);
  const demandeConfirmationPossible = statut === 'demandé' && !recandidature;

  const [instruction, setInstruction] = useState('');

  return (
    <>
      {instructionEnCours && réponsePermise ? (
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
                          checked: instruction === 'demander-confirmation',
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
                    checked: instruction === 'accorder',
                  },
                },
                {
                  label: 'rejeter',
                  nativeInputProps: {
                    value: 'rejeter',
                    onClick: () => {
                      setInstruction('rejeter');
                    },
                    checked: instruction === 'rejeter',
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
          {instruction === 'rejeter' && (
            <RejeterAbandonForm identifiantProjet={identifiantProjet} utilisateur={utilisateur} />
          )}
          {instruction === 'accorder' && (
            <AccorderAbandonForm identifiantProjet={identifiantProjet} utilisateur={utilisateur} />
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};

'use client';

import { Heading2 } from '../../atoms/headings';
import { StatutAbandonBadge } from '../../molecules/abandon/StatutAbandonBadge';
import { Utilisateur } from '@/utils/getUtilisateur';
import { DemanderConfirmationAbandonForm } from './demander/DemanderConfirmationAbandonForm';
import { RejeterAbandonForm } from './rejeter/RejeterAbandonForm';
import { AccorderAbandonSansRecandidatureForm } from './accorder/AccorderAbandonSansRecandidatureForm';
import { AccorderAbandonAvecRecandidatureForm } from './accorder/AccorderAbandonAvecRecandidatureForm';

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

  return (
    <>
      {instructionEnCours && réponsePermise ? (
        <div className="w-1/4">
          <Heading2>Instruire la demande</Heading2>
          {demandeConfirmationPossible && (
            <DemanderConfirmationAbandonForm
              identifiantProjet={identifiantProjet}
              utilisateur={utilisateur}
            />
          )}
          <RejeterAbandonForm identifiantProjet={identifiantProjet} utilisateur={utilisateur} />
          {recandidature ? (
            <AccorderAbandonAvecRecandidatureForm
              identifiantProjet={identifiantProjet}
              utilisateur={utilisateur}
            />
          ) : !recandidature ? (
            <AccorderAbandonSansRecandidatureForm
              identifiantProjet={identifiantProjet}
              utilisateur={utilisateur}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
};

'use client';

import { accorderAbandonAvecRecandidatureAction } from './accorderAbandonAvecRecandidature.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

type AccorderAbandonAvecRecandidatureFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const AccorderAbandonAvecRecandidature = ({
  identifiantProjet,
  utilisateur,
}: AccorderAbandonAvecRecandidatureFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Accorder"
      description="Accorder l'abandon"
      form={{
        id: 'accorder-abandon-form',
        action: accorderAbandonAvecRecandidatureAction,
        method: 'post',
        encType: 'multipart/form-data',
        onSuccess: () => router.push(`/laureat/${encodeURIComponent(identifiantProjet)}/abandon`),
        children: (
          <>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
          </>
        ),
      }}
    />
  );
};

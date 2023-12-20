'use client';

import { accorderAbandonAvecRecandidatureAction } from './accorderAbandonAvecRecandidature.action';
import { useRouter } from 'next/navigation';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

type AccorderAbandonAvecRecandidatureFormProps = {
  identifiantProjet: string;
  identifiantUtilisateur: string;
};

export const AccorderAbandonAvecRecandidature = ({
  identifiantProjet,
  identifiantUtilisateur,
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
            <input type={'hidden'} value={identifiantUtilisateur} name="identifiantUtilisateur" />
          </>
        ),
      }}
    />
  );
};

'use client';

import { accorderAbandonAvecRecandidatureAction } from './accorderAbandonAvecRecandidature.action';
import { useRouter } from 'next/navigation';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';
import { Routes } from '@potentiel-libraries/routes';

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
      yesNo
      description="Accorder l'abandon"
      form={{
        id: 'accorder-abandon-avec-recandidature-form',
        action: accorderAbandonAvecRecandidatureAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.Abandon.détail(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir accorder cet abandon ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <input type={'hidden'} value={identifiantUtilisateur} name="identifiantUtilisateur" />
          </>
        ),
      }}
    />
  );
};

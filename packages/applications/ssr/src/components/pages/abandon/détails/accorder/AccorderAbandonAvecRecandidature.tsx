'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { accorderAbandonAvecRecandidatureAction } from './accorderAbandonAvecRecandidature.action';

type AccorderAbandonAvecRecandidatureFormProps = {
  identifiantProjet: string;
};

export const AccorderAbandonAvecRecandidature = ({
  identifiantProjet,
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
          </>
        ),
      }}
    />
  );
};

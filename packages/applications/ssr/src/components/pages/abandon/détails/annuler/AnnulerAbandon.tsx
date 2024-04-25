'use client';

import { useRouter } from 'next/navigation';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { annulerAbandonAction } from './annulerAbandon.action';

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
};

export const AnnulerAbandon = ({ identifiantProjet }: AnnulerAbandonFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Annuler"
      yesNo
      description="Annuler l'abandon"
      form={{
        action: annulerAbandonAction,
        method: 'post',
        id: 'annuler-abandon-form',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.back(),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir annuler cet abandon ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    ></ButtonWithFormInModal>
  );
};

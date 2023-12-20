'use client';

import { annulerAbandonAction } from './annulerAbandon.action';
import { useRouter } from 'next/navigation';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
  identifiantUtilisateur: string;
};

export const AnnulerAbandon = ({
  identifiantProjet,
  identifiantUtilisateur,
}: AnnulerAbandonFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Annuler"
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
            <input type={'hidden'} value={identifiantUtilisateur} name="identifiantUtilisateur" />
          </>
        ),
      }}
    />
  );
};

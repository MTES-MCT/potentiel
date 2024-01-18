'use client';

import { useRouter } from 'next/navigation';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';
import { encodeParameter } from '@/utils/encodeParameter';

import { confirmerAbandonAction } from './confirmerAbandon.action';

type ConfirmerAbandonFormProps = {
  identifiantProjet: string;
  identifiantUtilisateur: string;
};

export const ConfirmerAbandon = ({
  identifiantProjet,
  identifiantUtilisateur,
}: ConfirmerAbandonFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Confirmer"
      description="Confirmer l'abandon"
      form={{
        action: confirmerAbandonAction,
        method: 'post',
        id: 'confirmer-abandon-form',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir confirmer cet abandon ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <input type={'hidden'} value={identifiantUtilisateur} name="identifiantUtilisateur" />
          </>
        ),
      }}
    />
  );
};

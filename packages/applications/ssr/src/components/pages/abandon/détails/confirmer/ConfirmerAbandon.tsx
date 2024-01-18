'use client';

import { Routes } from '@potentiel-libraries/routes';
import { useRouter } from 'next/navigation';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { confirmerAbandonAction } from './confirmerAbandon.action';

type ConfirmerAbandonFormProps = {
  identifiantProjet: string;
};

export const ConfirmerAbandon = ({ identifiantProjet }: ConfirmerAbandonFormProps) => {
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
        onSuccess: () => router.push(Routes.Abandon.détail(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir confirmer cet abandon ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};

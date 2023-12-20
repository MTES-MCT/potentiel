'use client';

import { confirmerAbandonAction } from './confirmerAbandon.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import { encodeParameter } from '@/utils/encodeParameter';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

type ConfirmerAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const ConfirmerAbandon = ({ identifiantProjet, utilisateur }: ConfirmerAbandonFormProps) => {
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
            <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
          </>
        ),
      }}
    />
  );
};

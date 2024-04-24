'use client';

import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

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
        onSuccess: () => router.refresh(),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir confirmer cet abandon ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
        buttons: (
          <>
            <Button priority="secondary">Non</Button>
            <SubmitButton>Oui</SubmitButton>
          </>
        ),
      }}
    />
  );
};

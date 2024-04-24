'use client';

import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

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

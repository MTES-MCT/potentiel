'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { CorrigerDocumentModalForm } from '../../../../organisms/corrigerDocument/CorrigerDocumentModalForm';

type CorrigerCourrierRéponseProps = {
  courrierRéponse: string;
  identifiantProjet: string;
};

export const CorrigerCourrierRéponse = ({
  identifiantProjet,
  courrierRéponse,
}: CorrigerCourrierRéponseProps) => {
  const router = useRouter();

  return (
    <CorrigerDocumentModalForm
      onSuccess={() => router.push(Routes.GarantiesFinancières.détail(identifiantProjet))}
      title="Corriger le courrier de réponse"
      uploadDocumentLabel="Nouveau courrier de réponse"
      buttonLabel="Corriger le courrier de réponse"
      documentKey={courrierRéponse}
    />
  );
};

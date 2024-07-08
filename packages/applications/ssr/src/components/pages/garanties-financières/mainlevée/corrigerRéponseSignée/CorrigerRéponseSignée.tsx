'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { CorrigerDocumentModalForm } from '@/components/organisms/corrigerDocument/CorrigerDocumentModalForm';

type CorrigerRéponseSignéeProps = {
  courrierRéponse: string;
  identifiantProjet: string;
};

export const CorrigerRéponseSignée = ({
  identifiantProjet,
  courrierRéponse,
}: CorrigerRéponseSignéeProps) => {
  const router = useRouter();

  return (
    <CorrigerDocumentModalForm
      onSuccess={() => router.push(Routes.GarantiesFinancières.détail(identifiantProjet))}
      title="Télécharger une nouvelle réponse signée"
      uploadDocumentLabel="Nouvelle réponse signée"
      buttonLabel="Corriger la réponse signée"
      documentKey={courrierRéponse}
    />
  );
};

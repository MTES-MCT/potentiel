'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { CorrigerDocumentForm } from '@/components/organisms/corrigerDocument/CorrigerDocument.form';

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
    <CorrigerDocumentForm
      onSuccess={() => router.push(Routes.GarantiesFinancières.détail(identifiantProjet))}
      title="Télécharger une nouvelle réponse signée"
      uploadDocumentLabel="Nouvelle réponse signée"
      buttonLabel="Corriger la réponse signée"
      documentKey={courrierRéponse}
    />
  );
};

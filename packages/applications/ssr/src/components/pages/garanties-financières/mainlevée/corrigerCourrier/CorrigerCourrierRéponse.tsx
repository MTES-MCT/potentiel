'use client';

import { useRouter } from 'next/navigation';

import { CorrigerDocumentModalForm } from '../../../../organisms/corrigerDocument/CorrigerDocumentModalForm';

type CorrigerCourrierRéponseProps = {
  courrierRéponse: string;
  identifiantProjet: string;
};

  courrierRéponse: string;
  identifiantProjet: string;
  title?: string;
  buttonLabel?: string;
  confirmationLabel?: string;
  documentKey: string;
  onSuccess?: FormProps['onSuccess'];

export const CorrigerCourrierRéponse = ({
  identifiantProjet,
  courrierRéponse,
}: CorrigerCourrierRéponseProps) => {
  const router = useRouter();

  return <CorrigerDocumentModalForm onSuccess={() => router.push("/")} title={"Corriger le courrier de réponse"}></CorrigerDocumentModalForm>;
};

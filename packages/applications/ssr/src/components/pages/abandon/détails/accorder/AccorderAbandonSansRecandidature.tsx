'use client';

import { Download } from '@codegouvfr/react-dsfr/Download';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { accorderAbandonSansRecandidatureAction } from './accorderAbandonSansRecandidature.action';

type AccorderAbandonSansRecandidatureFormProps = {
  identifiantProjet: string;
};

export const AccorderAbandonSansRecandidature = ({
  identifiantProjet,
}: AccorderAbandonSansRecandidatureFormProps) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ButtonWithFormInModal
      name="Accorder"
      description="Accorder l'abandon"
      form={{
        action: accorderAbandonSansRecandidatureAction,
        method: 'post',
        encType: 'multipart/form-data',
        id: 'accorder-abandon-form',
        onSuccess: () => router.push(Routes.Abandon.détail(identifiantProjet)),
        onValidationError: (validationErrors) => setValidationErrors(validationErrors),
        children: (
          <>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

            <Upload
              label="Téléverser une réponse signée"
              hint="au format pdf"
              state={validationErrors.includes('reponseSignee') ? 'error' : 'default'}
              stateRelatedMessage="Réponse signée obligatoire"
              nativeInputProps={{
                name: 'reponseSignee',
                required: true,
                'aria-required': true,
              }}
              className="mb-4"
            />

            <Download
              linkProps={{
                href: Routes.Abandon.téléchargerModèleRéponse(identifiantProjet),
              }}
              details="docx"
              label="Télécharger le modèle de réponse"
              className="mb-4"
            />
          </>
        ),
      }}
    />
  );
};

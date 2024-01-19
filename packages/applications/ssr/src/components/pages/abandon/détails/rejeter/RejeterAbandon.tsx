'use client';

import Download from '@codegouvfr/react-dsfr/Download';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { rejeterAbandonAction } from './rejeterAbandon.action';

type RejeterAbandonFormProps = {
  identifiantProjet: string;
};

export const RejeterAbandon = ({ identifiantProjet }: RejeterAbandonFormProps) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ButtonWithFormInModal
      name="Rejeter"
      description="Rejeter l'abandon"
      form={{
        action: rejeterAbandonAction,
        method: 'post',
        encType: 'multipart/form-data',
        id: 'rejeter-abandon-form',
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
              className="mt-4"
            />
          </>
        ),
      }}
    />
  );
};

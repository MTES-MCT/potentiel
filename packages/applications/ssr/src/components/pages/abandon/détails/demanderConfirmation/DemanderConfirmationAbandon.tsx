'use client';

import Download from '@codegouvfr/react-dsfr/Download';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { demanderConfirmationAbandonAction } from './demanderConfirmation.action';

type DemanderConfirmationAbandonFormProps = {
  identifiantProjet: string;
};

export const DemanderConfirmationAbandon = ({
  identifiantProjet,
}: DemanderConfirmationAbandonFormProps) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ButtonWithFormInModal
      name="Demander la confirmation"
      description="Demander la confirmation de l'abandon"
      form={{
        id: 'demande-confirmation-abandon-form',
        action: demanderConfirmationAbandonAction,
        method: 'post',
        encType: 'multipart/form-data',
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
              className="mb-8"
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

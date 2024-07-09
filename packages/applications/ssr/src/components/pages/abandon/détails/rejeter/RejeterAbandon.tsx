'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { rejeterAbandonAction } from './rejeterAbandon.action';

type RejeterAbandonFormProps = {
  identifiantProjet: string;
};

export const RejeterAbandon = ({ identifiantProjet }: RejeterAbandonFormProps) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-full text-center"
      >
        Rejeter
      </Button>

      <ModalWithForm
        title="Rejeter l'abandon"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterAbandonAction,
          method: 'POST',
          encType: 'multipart/form-data',
          id: 'rejeter-abandon-form',
          onSuccess: () => router.refresh(),
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

              <UploadDocument
                label="Réponse signée"
                state={validationErrors.includes('reponseSignee') ? 'error' : 'default'}
                name="reponseSignee"
                required
                className="mb-4"
              />

              <DownloadDocument
                className="mt-4"
                url={Routes.Abandon.téléchargerModèleRéponse(identifiantProjet)}
                format="docx"
                label="Télécharger le modèle de réponse"
              />
            </>
          ),
        }}
      />
    </>
  );
};

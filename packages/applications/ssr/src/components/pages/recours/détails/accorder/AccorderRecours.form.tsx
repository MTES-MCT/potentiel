'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { accorderRecoursAction } from './accorderRecours.action';

type AccorderRecoursFormProps = {
  identifiantProjet: string;
};

export const AccorderRecours = ({ identifiantProjet }: AccorderRecoursFormProps) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Accorder
      </Button>

      <ModalWithForm
        title="Accorder le recours"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderRecoursAction,
          method: 'POST',
          encType: 'multipart/form-data',
          id: 'accorder-recours-form',
          onSuccess: () => router.push(Routes.Recours.détail(identifiantProjet)),
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
                className="mb-4"
                url={Routes.Recours.téléchargerModèleRéponse(identifiantProjet)}
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

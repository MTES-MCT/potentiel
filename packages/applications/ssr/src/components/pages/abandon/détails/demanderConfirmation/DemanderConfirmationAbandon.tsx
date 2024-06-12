'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { InputDownload } from '@/components/atoms/form/InputDownload';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { demanderConfirmationAbandonAction } from './demanderConfirmation.action';

type DemanderConfirmationAbandonFormProps = {
  identifiantProjet: string;
};

export const DemanderConfirmationAbandon = ({
  identifiantProjet,
}: DemanderConfirmationAbandonFormProps) => {
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
        Demander la confirmation
      </Button>

      <ModalWithForm
        title="Demander la confirmation de l'abandon"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'demande-confirmation-abandon-form',
          action: demanderConfirmationAbandonAction,
          method: 'post',
          encType: 'multipart/form-data',
          onSuccess: () => router.refresh(),
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

              <UploadDocument
                label="Téléverser une réponse signée"
                state={validationErrors.includes('reponseSignee') ? 'error' : 'default'}
                stateRelatedMessage="Réponse signée obligatoire"
                name="reponseSignee"
                required
                className="mb-8"
              />

              <InputDownload
                ariaLabel={`Télécharger le modèle de réponse pour demander la confirmation de la demande d'abandon `}
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
    </>
  );
};

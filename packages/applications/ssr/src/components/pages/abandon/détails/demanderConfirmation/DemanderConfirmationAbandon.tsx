'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

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

              <Upload
                label="Téléverser une réponse signée"
                hint="au format pdf"
                state={validationErrors.includes('reponseSignee') ? 'error' : 'default'}
                stateRelatedMessage="Réponse signée obligatoire"
                nativeInputProps={{
                  name: 'reponseSignee',
                  required: true,
                  'aria-required': true,
                  accept: '.pdf',
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
    </>
  );
};

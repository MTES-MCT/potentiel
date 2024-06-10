'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { InputDownload } from '@/components/atoms/form/InputDownload';

import { accorderAbandonSansRecandidatureAction } from './accorderAbandonSansRecandidature.action';

type AccorderAbandonSansRecandidatureFormProps = {
  identifiantProjet: string;
};

export const AccorderAbandonSansRecandidature = ({
  identifiantProjet,
}: AccorderAbandonSansRecandidatureFormProps) => {
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
        Accorder
      </Button>

      <ModalWithForm
        title="Accorder l'abandon"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
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
                  accept: '.pdf',
                }}
                className="mb-4"
              />

              <InputDownload
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

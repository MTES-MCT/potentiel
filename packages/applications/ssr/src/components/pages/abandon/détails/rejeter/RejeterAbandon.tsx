'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

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
          method: 'post',
          encType: 'multipart/form-data',
          id: 'rejeter-abandon-form',
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
                className="mb-4"
              />

              <Download
                linkProps={{
                  href: Routes.Abandon.téléchargerModèleRéponse(identifiantProjet),
                  target: '_blank',
                }}
                details="docx"
                label="Télécharger le modèle de réponse"
                className="mt-4"
              />
            </>
          ),
        }}
      />
    </>
  );
};

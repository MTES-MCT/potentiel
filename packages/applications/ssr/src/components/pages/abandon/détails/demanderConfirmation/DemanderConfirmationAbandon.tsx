'use client';

import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { demanderConfirmationAbandonAction } from './demanderConfirmation.action';
import { useRouter } from 'next/navigation';
import { encodeParameter } from '@/utils/encodeParameter';
import Download from '@codegouvfr/react-dsfr/Download';

import { useState } from 'react';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

type DemanderConfirmationAbandonFormProps = {
  identifiantProjet: string;
  identifiantUtilisateur: string;
};

export const DemanderConfirmationAbandon = ({
  identifiantProjet,
  identifiantUtilisateur,
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
        onSuccess: () => router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`),
        onValidationError: (validationErrors) => setValidationErrors(validationErrors),
        children: (
          <>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <input type={'hidden'} value={identifiantUtilisateur} name="identifiantUtilisateur" />

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
                href: `/laureat/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`,
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

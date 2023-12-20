'use client';

import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { rejeterAbandonAction } from './rejeterAbandon.action';
import { useRouter } from 'next/navigation';
import { encodeParameter } from '@/utils/encodeParameter';
import Download from '@codegouvfr/react-dsfr/Download';
import { useState } from 'react';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

type RejeterAbandonFormProps = {
  identifiantProjet: string;
  identifiantUtilisateur: string;
};

export const RejeterAbandon = ({
  identifiantProjet,
  identifiantUtilisateur,
}: RejeterAbandonFormProps) => {
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
              className="mb-4"
            />

            <Download
              linkProps={{
                href: `/laureat/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`,
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

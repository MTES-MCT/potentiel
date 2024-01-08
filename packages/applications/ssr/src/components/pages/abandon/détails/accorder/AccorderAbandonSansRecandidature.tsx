'use client';

import { Download } from '@codegouvfr/react-dsfr/Download';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { accorderAbandonSansRecandidatureAction } from './accorderAbandonSansRecandidature.action';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';
import { encodeUrl } from '@/utils/encodeUrl';

type AccorderAbandonSansRecandidatureFormProps = {
  identifiantProjet: string;
  identifiantUtilisateur: string;
};

export const AccorderAbandonSansRecandidature = ({
  identifiantProjet,
  identifiantUtilisateur,
}: AccorderAbandonSansRecandidatureFormProps) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ButtonWithFormInModal
      name="Accorder"
      description="Accorder l'abandon"
      form={{
        action: accorderAbandonSansRecandidatureAction,
        method: 'post',
        encType: 'multipart/form-data',
        id: 'accorder-abandon-form',
        onSuccess: () =>
          router.push(
            encodeUrl('/laureats/:identifiantProjet/abandon', {
              identifiantProjet,
            }),
          ),
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
                href: encodeUrl('/laureats/:identifiantProjet/abandon/modele-reponse', {
                  identifiantProjet,
                }),
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

'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { InputDownload } from '@/components/atoms/form/InputDownload';

import { accorderDemandeMainlevéeGarantiesFinancièresAction } from './accorderDemandeMainlevéeGarantiesFinancières.action';

type AccorderDemandeMainlevéeGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const AccorderDemandeMainlevéeGarantiesFinancières = ({
  identifiantProjet,
}: AccorderDemandeMainlevéeGarantiesFinancièresFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Accorder
      </Button>

      <ModalWithForm
        title="Accorder la demande"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderDemandeMainlevéeGarantiesFinancièresAction,
          method: 'post',
          encType: 'multipart/form-data',
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),

          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir accorder la demande de mainlevée ?</p>

              <InputDownload
                ariaLabel="Télécharger le modèle de réponse de l'accord d'une demande de mainlevée des garanties financières"
                details="fichier au format docx"
                label="Télécharger le modèle de réponse"
                linkProps={{
                  href: Routes.GarantiesFinancières.mainlevée.téléchargerModèleRéponse(
                    identifiantProjet,
                  ),
                }}
              />

              <UploadDocument
                label="Réponse signée"
                state={validationErrors.includes('reponseSignee') ? 'error' : 'default'}
                name="reponseSignee"
                required
                className="mb-4"
              />

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};

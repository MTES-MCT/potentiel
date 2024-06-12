'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Upload } from '@codegouvfr/react-dsfr/Upload';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { accorderDemandeMainlevéeGarantiesFinancièresAction } from './accorderDemandeMainlevéeGarantiesFinancières.action';

type AccorderDemandeMainlevéeGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const AccepterDemandeMainlevéeGarantiesFinancières = ({
  identifiantProjet,
}: AccorderDemandeMainlevéeGarantiesFinancièresFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Accorder la demande
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
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),

          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir accorder la demande de mainlevée ?</p>
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
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};

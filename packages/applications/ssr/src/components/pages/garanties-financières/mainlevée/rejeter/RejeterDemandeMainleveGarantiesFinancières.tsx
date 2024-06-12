'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Upload } from '@codegouvfr/react-dsfr/Upload';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { rejeterDemandeMainlevéeGarantiesFinancièresAction } from './rejeterDemandeMainlevéeGarantiesFinancières.action';

type rejeterDemandeMainlevéeGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const RejeterDemandeMainlevéeGarantiesFinancières = ({
  identifiantProjet,
}: rejeterDemandeMainlevéeGarantiesFinancièresFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)}>
        Rejeter la demande
      </Button>

      <ModalWithForm
        title="Rejeter la demande"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Rejeter"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterDemandeMainlevéeGarantiesFinancièresAction,
          method: 'post',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),

          children: (
            <>
              <p className="mt-3">Rejeter la demande de mainlevée ?</p>
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

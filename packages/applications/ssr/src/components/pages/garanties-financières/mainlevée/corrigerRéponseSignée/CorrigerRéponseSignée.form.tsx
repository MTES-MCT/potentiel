'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { corrigerRéponseSignéeAction } from './corrigerRéponseSignée.action';

type CorrigerRéponseSignéeProps = {
  courrierRéponseÀCorriger: string;
  identifiantProjet: string;
};

export const CorrigerRéponseSignée = ({
  identifiantProjet,
  courrierRéponseÀCorriger,
}: CorrigerRéponseSignéeProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)} style={{ marginTop: 0 }}>
        Corriger la réponse signée
      </Button>

      <ModalWithForm
        id="corriger-réponse-signée-mainlevée-gf"
        title="Corriger la réponse signée"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'corriger-document-form',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          action: corrigerRéponseSignéeAction,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir corriger le document ?</p>
              <UploadDocument
                name="documentCorrige"
                id="documentCorrige"
                label="Nouvelle réponse signée"
              />

              <input
                type={'hidden'}
                value={courrierRéponseÀCorriger}
                name="courrierReponseACorriger"
              />
            </>
          ),
        }}
      />
    </>
  );
};

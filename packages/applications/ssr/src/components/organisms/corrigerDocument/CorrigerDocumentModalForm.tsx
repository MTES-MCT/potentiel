'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { FormProps } from '../../atoms/form/Form';
import { UploadDocument } from '../../atoms/form/UploadDocument';

import { corrigerDocumentAction } from './corrigerDocument.action';

type CorrigerDocumentModalFormProps = {
  identifiantProjet: string;
  title?: string;
  buttonLabel?: string;
  confirmationLabel?: string;
  documentKey: string;
  uploadDocumentLabel?: string;
  onSuccess?: FormProps['onSuccess'];
};

const defaultButtonLabel = 'Corriger';
const defaultTitle = 'Corriger le document';
const defaultConfirmationLabel = 'Êtes-vous sûr de vouloir corriger ce document ?';
const defaultUploadDocumentLabel = 'Fichier corrigé';

export const CorrigerDocumentModalForm = ({
  identifiantProjet,
  title = defaultTitle,
  buttonLabel = defaultButtonLabel,
  confirmationLabel = defaultConfirmationLabel,
  uploadDocumentLabel = defaultUploadDocumentLabel,
  documentKey,
  onSuccess,
}: CorrigerDocumentModalFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)}>
        {buttonLabel}
      </Button>

      <ModalWithForm
        title={title}
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'corriger-document-form',
          method: 'post',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess,
          action: corrigerDocumentAction,
          children: (
            <>
              <p className="mt-3">{confirmationLabel}</p>
              <UploadDocument
                name="documentCorrigé"
                id="documentCorrigé"
                label={uploadDocumentLabel}
              />
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={documentKey} name="documentKey" />
            </>
          ),
        }}
      />
    </>
  );
};

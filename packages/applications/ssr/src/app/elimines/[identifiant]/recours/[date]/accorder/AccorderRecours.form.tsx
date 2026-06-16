'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { InputDate } from '@/components/atoms/form/InputDate';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import type { ValidationErrors } from '@/utils/formAction';
import { type AccorderRecoursFormKeys, accorderRecoursAction } from './accorderRecours.action';

type AccorderRecoursFormProps = {
  identifiantProjet: string;
  date: PlainType<DateTime.ValueType>;
  dateNotification: DateTime.RawType;
};

export const AccorderRecours = ({
  identifiantProjet,
  date,
  dateNotification,
}: AccorderRecoursFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderRecoursFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Accorder
      </Button>

      <ModalWithForm
        id="accorder-recours-modal"
        title="Accorder le recours"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderRecoursAction,
          id: 'accorder-recours-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

              <InputDate
                label={`Date de l'accord du recours`}
                name="dateRéponseSignée"
                hintText={`Saisir la date à laquelle le recours a réellement été accordé (date de la réponse signée). Elle tiendra lieu de date de désignation du lauréat.`}
                min={dateNotification}
                max={DateTime.now().formatter()}
                state={validationErrors['dateRéponseSignée'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['dateRéponseSignée']}
              />

              <UploadNewOrModifyExistingDocument
                label="Réponse signée"
                state={validationErrors['reponseSignee'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['reponseSignee']}
                name="reponseSignee"
                required
                className="mb-4"
                formats={['pdf']}
              />

              <DownloadDocument
                className="mb-4"
                url={Routes.Recours.téléchargerModèleRéponse(identifiantProjet, date.date)}
                format="docx"
                label="Télécharger le modèle de réponse"
              />
            </>
          ),
        }}
      />
    </>
  );
};

'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  rejeterDemandeDélaiAction,
  RejeterDemandeDélaiFormKeys,
} from './rejeterDemandeDélai.action';

type RejeterDemandeDélaiFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDemande: DateTime.RawType;
};

export const RejeterDemandeDélai = ({
  identifiantProjet,
  dateDemande,
}: RejeterDemandeDélaiFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RejeterDemandeDélaiFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Rejeter
      </Button>

      <ModalWithForm
        id="rejeter-demande-délai"
        title="Rejeter la demande de délai"
        cancelButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterDemandeDélaiAction,
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          id: 'rejeter-demande-délai-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir rejeter la demande de délai ?</p>

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={dateDemande} name="dateDemande" />

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
                url={Routes.Délai.téléchargerModèleRéponse(identifiantProjet, dateDemande)}
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

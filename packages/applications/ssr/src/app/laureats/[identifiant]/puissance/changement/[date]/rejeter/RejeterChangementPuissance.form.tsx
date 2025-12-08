'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import {
  rejeterChangementPuissanceAction,
  RejeterChangementPuissanceFormKeys,
} from './rejeterChangementPuissance.action';

type RejeterChangementPuissanceFormProps = {
  identifiantProjet: string;
  estÀLaBaisse: boolean;
};

export const RejeterChangementPuissanceForm = ({
  identifiantProjet,
  estÀLaBaisse,
}: RejeterChangementPuissanceFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RejeterChangementPuissanceFormKeys>
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
        id="rejeter-changement-puissance-modal"
        title="Rejeter la demande de changement de puissance"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterChangementPuissanceAction,
          id: 'rejeter-changement-puissance-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir rejeter ce changement de puissance ?</p>

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

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
                url={Routes.Puissance.changement.téléchargerModèleRéponseRejeté(identifiantProjet)}
                format="docx"
                label="Télécharger le modèle de réponse"
              />
              {estÀLaBaisse && (
                <Checkbox
                  state={validationErrors['estUneDecisionDEtat'] ? 'error' : 'default'}
                  stateRelatedMessage={validationErrors['estUneDecisionDEtat']}
                  options={[
                    {
                      label:
                        "La demande de changement de puissance fait suite à une décision de l'État",
                      nativeInputProps: {
                        value: 'true',
                        name: 'estUneDecisionDEtat',
                      },
                    },
                  ]}
                />
              )}
            </>
          ),
        }}
      />
    </>
  );
};

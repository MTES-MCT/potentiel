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
  accorderChangementPuissanceAction,
  AccorderChangementPuissanceFormKeys,
} from './accorderChangementPuissance.action';

type AccorderChangementPuissanceFormProps = {
  identifiantProjet: string;
};

export const AccorderChangementPuissance = ({
  identifiantProjet,
}: AccorderChangementPuissanceFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderChangementPuissanceFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);
  const [réponseSignée, setRéponseSignée] = useState<Array<string>>([]);
  const [estUneDecisionDEtat, setEstUneDecisionDEtat] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="block text-center">
        Accorder
      </Button>

      <ModalWithForm
        id="accorder-changement-puissance-modal"
        title="Accorder le changement de puissance"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        disabledSubmitCondition={() =>
          (!réponseSignée.length && !estUneDecisionDEtat) ||
          Object.keys(validationErrors).length > 0
        }
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderChangementPuissanceAction,
          id: 'accorder-changement-puissance-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir accorder ce changement de puissance ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <UploadNewOrModifyExistingDocument
                label={`Réponse signée${estUneDecisionDEtat ? ' (optionnel)' : ''}`}
                state={validationErrors['reponseSignee'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['reponseSignee']}
                name="reponseSignee"
                required={estUneDecisionDEtat === false}
                className="mb-4"
                formats={['pdf']}
                onChange={(réponseSignée) => {
                  delete validationErrors['reponseSignee'];
                  setRéponseSignée(réponseSignée);
                }}
              />
              <DownloadDocument
                className="mb-4"
                url={Routes.Puissance.changement.téléchargerModèleRéponseAccordé(identifiantProjet)}
                format="docx"
                label="Télécharger le modèle de réponse"
              />
              <input
                type={'hidden'}
                value={estUneDecisionDEtat ? 'true' : 'false'}
                name="estUneDecisionDEtat"
              />
              <Checkbox
                state={validationErrors['estUneDecisionDEtat'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['estUneDecisionDEtat']}
                options={[
                  {
                    label:
                      "La demande de changement de puissance fait suite à une décision de l'État",
                    nativeInputProps: {
                      onChange: (e) => setEstUneDecisionDEtat(e.target.checked),
                    },
                  },
                ]}
              />
            </>
          ),
        }}
      />
    </>
  );
};

'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type AccorderAbandonSansRecandidatureFormKeys,
  accorderAbandonSansRecandidatureAction,
} from './accorderAbandonSansRecandidature.action';

type AccorderAbandonSansRecandidatureFormProps = {
  identifiantProjet: string;
  ppaDéjàSignaléParLAdministration: boolean;
  ppaSignaléLorsDeLaDemande: boolean;
};

export const AccorderAbandonSansRecandidatureForm = ({
  identifiantProjet,
  ppaDéjàSignaléParLAdministration,
  ppaSignaléLorsDeLaDemande,
}: AccorderAbandonSansRecandidatureFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderAbandonSansRecandidatureFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);
  const [choixPPAPourAutoritéCompétente, setChoixPPAPourAutoritéCompétente] =
    useState(ppaSignaléLorsDeLaDemande);

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
        id="accorder-abandon-sans-recandidature"
        title="Accorder l'abandon"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderAbandonSansRecandidatureAction,
          id: 'accorder-abandon-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              {ppaDéjàSignaléParLAdministration && (
                <Notice
                  title={
                    "Ce projet a été signalé comme étant signataire d'un contrat de vente de gré à gré (PPA)"
                  }
                />
              )}
              {!ppaDéjàSignaléParLAdministration && (
                <>
                  {ppaSignaléLorsDeLaDemande ? (
                    <Notice
                      title={
                        "Ce projet a été signalé comme étant signataire d'un contrat de vente de gré à gré (PPA) par le porteur de projet. Vous pouvez changer cette information si elle n'est plus à jour."
                      }
                    />
                  ) : (
                    <Notice
                      title={
                        "Ce projet n'a pas été signalé comme étant signataire d'un contrat de vente de gré à gré (PPA) par le porteur de projet. Vous pouvez changer cette information si elle n'est plus à jour."
                      }
                    />
                  )}
                  <Select
                    state={validationErrors['choixPPAPourAutoritéCompétente'] ? 'error' : 'default'}
                    stateRelatedMessage={validationErrors['choixPPAPourAutoritéCompétente']}
                    id="choixPPAPourAutoritéCompétente"
                    label="Cet abandon est-il consécutif à la signature d'un contrat de vente de gré à gré (PPA) ?"
                    nativeSelectProps={{
                      defaultValue: ppaSignaléLorsDeLaDemande ? 'true' : 'false',
                      required: true,
                      'aria-required': true,
                      onChange: (e) => {
                        setChoixPPAPourAutoritéCompétente(e.target.value === 'true');
                      },
                    }}
                    options={[
                      { label: 'Oui', value: 'true' },
                      { label: 'Non', value: 'false' },
                    ]}
                  />
                  <input
                    type={'hidden'}
                    value={choixPPAPourAutoritéCompétente ? 'true' : 'false'}
                    name="choixPPAPourAutoritéCompétente"
                    disabled={choixPPAPourAutoritéCompétente === ppaSignaléLorsDeLaDemande}
                  />
                </>
              )}

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
                url={Routes.Abandon.téléchargerModèleRéponse(identifiantProjet)}
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

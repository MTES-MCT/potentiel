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
  ppaSignaléLorsDeLaDemandeEtToujoursActif: boolean;
  estPPA: boolean;
  ppaSignaléLorsDeLaDemande?: boolean;
};

export const AccorderAbandonSansRecandidatureForm = ({
  identifiantProjet,
  estPPA,
  ppaSignaléLorsDeLaDemande,
  ppaSignaléLorsDeLaDemandeEtToujoursActif,
}: AccorderAbandonSansRecandidatureFormProps) => {
  const ppaDéjàSignaléParLAdministration = estPPA && !ppaSignaléLorsDeLaDemande;
  const ppaSignaléLorsDeLaDemandePuisAnnulé = ppaSignaléLorsDeLaDemande === true && !estPPA;

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderAbandonSansRecandidatureFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);
  const [choixPPAPourAutoritéCompétente, setChoixPPAPourAutoritéCompétente] = useState(
    estPPA === true,
  );

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
              {ppaDéjàSignaléParLAdministration ? (
                <Notice
                  title={
                    "Ce projet a été signalé comme étant signataire d'un contrat de vente de gré à gré (PPA) par l'administration. Vous pouvez mettre à jour cette information depuis la page projet."
                  }
                />
              ) : (
                <>
                  {ppaSignaléLorsDeLaDemandeEtToujoursActif && (
                    <Notice title="Ce projet a été signalé en PPA par le porteur. Vous pouvez mettre à jour cette information." />
                  )}
                  {ppaSignaléLorsDeLaDemandePuisAnnulé && (
                    <Notice title="Ce projet a été signalé en PPA par le porteur lors de sa demande d'abandon, le signalement a ensuite été annulé par l'administration." />
                  )}
                  <Select
                    state={validationErrors['choixPPAPourAutoritéCompétente'] ? 'error' : 'default'}
                    stateRelatedMessage={validationErrors['choixPPAPourAutoritéCompétente']}
                    id="choixPPAPourAutoritéCompétente"
                    label="Cet abandon est-il consécutif à la signature d'un PPA ?"
                    nativeSelectProps={{
                      defaultValue: estPPA ? 'true' : 'false',
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
                    disabled={choixPPAPourAutoritéCompétente === estPPA}
                  />
                </>
              )}

              <div className="flex flex-col gap-1">
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
                  className="mb-2"
                  url={Routes.Abandon.téléchargerModèleRéponse(identifiantProjet)}
                  format="docx"
                  label="Télécharger le modèle de réponse"
                  small
                  hideFormat
                />
              </div>
            </>
          ),
        }}
      />
    </>
  );
};

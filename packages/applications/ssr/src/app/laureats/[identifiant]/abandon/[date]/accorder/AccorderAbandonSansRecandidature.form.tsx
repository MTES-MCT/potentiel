'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
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
  afficherChampMainlevéeGarantiesFinancières: boolean;
  afficherNoticeAttestationGarantiesFinancièresÀConstituer: boolean;
};

export const AccorderAbandonSansRecandidatureForm = ({
  identifiantProjet,
  estPPA,
  ppaSignaléLorsDeLaDemande,
  ppaSignaléLorsDeLaDemandeEtToujoursActif,
  afficherChampMainlevéeGarantiesFinancières,
  afficherNoticeAttestationGarantiesFinancièresÀConstituer,
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
  const [accorderMainLevée, setAccorderMainlevée] = useState<boolean>(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block text-center shrink-0"
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
              {afficherNoticeAttestationGarantiesFinancièresÀConstituer && (
                <Notice
                  title=""
                  description={
                    <>
                      L'attestation de constitution des garanties financières reste à transmettre
                      pour vous permettre d'accorder une mainlevée avec l'abandon.{' '}
                      <TertiaryLink
                        href={Routes.GarantiesFinancières.actuelles.enregistrerAttestation(
                          identifiantProjet,
                        )}
                      >
                        Enregistrer l'attestation
                        <span className="sr-only"> des garanties financières</span>
                      </TertiaryLink>
                    </>
                  }
                />
              )}
              {ppaDéjàSignaléParLAdministration ? (
                <Notice title="Ce projet a été signalé comme étant signataire d'un contrat de vente de gré à gré (PPA) par l'administration. Vous pouvez mettre à jour cette information depuis la page projet." />
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

              {afficherChampMainlevéeGarantiesFinancières && (
                <div>
                  <Select
                    state={
                      validationErrors['accorderMainlevéeGarantiesFinancières']
                        ? 'error'
                        : 'default'
                    }
                    stateRelatedMessage={validationErrors['accorderMainlevéeGarantiesFinancières']}
                    id="accorderMainlevéeGarantiesFinancières"
                    label="Accorder la mainlevée des garanties financières ?"
                    nativeSelectProps={{
                      name: 'accorderMainlevéeGarantiesFinancières',
                      required: true,
                      'aria-required': true,
                      onChange: (e) => {
                        setAccorderMainlevée(e.target.value === 'true');
                      },
                      className: 'mb-5',
                    }}
                    options={[
                      { label: 'Oui', value: 'true' },
                      { label: 'Non', value: 'false' },
                    ]}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <UploadNewOrModifyExistingDocument
                  label="Réponse signée"
                  state={validationErrors['réponseSignée'] ? 'error' : 'default'}
                  stateRelatedMessage={validationErrors['réponseSignée']}
                  name="réponseSignée"
                  required
                  className="mb-4"
                  formats={['pdf']}
                />

                <DownloadDocument
                  className="mb-2"
                  url={Routes.Abandon.téléchargerModèleRéponse({
                    identifiantProjet,
                    ...(accorderMainLevée && { accorderMainlevéeGarantiesFinancières: true }),
                  })}
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

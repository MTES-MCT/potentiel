'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import type { ValidationErrors } from '@/utils/formAction';
import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';
import {
  type AccorderDemandeDélaiFormKeys,
  accorderDemandeDélaiAction,
} from './accorderDemandeDélai.action';

type AccorderDemandeDélaiFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDemande: DateTime.RawType;
  dateAchèvementPrévisionnelActuelle: PlainType<Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType>;
  nombreDeMois: number;
  motif: Lauréat.Délai.MotifDemandeDélai.RawType;
};

export const AccorderDemandeDélaiForm = ({
  identifiantProjet,
  dateDemande,
  nombreDeMois,
  dateAchèvementPrévisionnelActuelle,
  motif,
}: AccorderDemandeDélaiFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderDemandeDélaiFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  const dateActuelle = Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
    dateAchèvementPrévisionnelActuelle,
  );

  const [nouvelleDate, setNouvelleDate] = useState(dateActuelle.ajouterDélai(nombreDeMois));
  const [nouveauMotif, setNouveauMotif] = useState<Lauréat.Délai.MotifDemandeDélai.RawType>(motif);

  const afficherNouvelleDateAchèvement =
    nouvelleDate.dateTime.estUltérieureÀ(dateActuelle.dateTime) &&
    Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(
      nouveauMotif,
    ).estProlongationDélaiAchèvement();

  const ajouterDélaiÀLaDateActuelle = (nombreDeMois: number) => {
    const nouvelleDate = dateActuelle.ajouterDélai(nombreDeMois);

    setNouvelleDate(nouvelleDate);
  };

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
        id="accorder-demande-délai"
        title="Accorder la demande de délai"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        form={{
          action: accorderDemandeDélaiAction,
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          id: 'Accorder-demande-délai-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir accorder la demande de délai ?</p>

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={dateDemande} name="dateDemande" />

              <div>
                <Select
                  state={validationErrors['motif'] ? 'error' : 'default'}
                  stateRelatedMessage={validationErrors['motif']}
                  id="motif"
                  label="Motif de la demande de délai"
                  className="w-fit"
                  nativeSelectProps={{
                    name: 'motif',
                    required: true,
                    value: nouveauMotif,
                    onChange: (e) => setNouveauMotif(e.target.value),
                    'aria-required': true,
                  }}
                  placeholder="Choisir un motif"
                  options={Lauréat.Délai.MotifDemandeDélai.motifs.map((motif) => ({
                    value: motif,
                    label: getMotifDemandeDélaiLabel(motif),
                  }))}
                />
                <Input
                  label="Durée du délai"
                  hintText="Veuillez saisir une durée de délai en mois, d'au minimum 1 mois"
                  className="w-full md:w-1/2"
                  nativeInputProps={{
                    min: '1',
                    name: 'nombreDeMois',
                    required: true,
                    'aria-required': true,
                    type: 'number',
                    inputMode: 'numeric',
                    pattern: '[1-9]*',
                    defaultValue: nombreDeMois,
                    onChange: (e) => ajouterDélaiÀLaDateActuelle(Number(e.target.value)),
                  }}
                  state={validationErrors['nombreDeMois'] ? 'error' : 'default'}
                  stateRelatedMessage={validationErrors['nombreDeMois']}
                />
                {afficherNouvelleDateAchèvement && (
                  <div>
                    Après accord de votre demande de délai, la date d'achèvement prévisionnel serait
                    le <FormattedDate date={nouvelleDate.formatter()} className="font-semibold" />
                  </div>
                )}
              </div>

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
                url={Routes.Délai.téléchargerModèleRéponse({
                  identifiantProjet,
                  date: dateDemande,
                  motif: nouveauMotif,
                })}
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

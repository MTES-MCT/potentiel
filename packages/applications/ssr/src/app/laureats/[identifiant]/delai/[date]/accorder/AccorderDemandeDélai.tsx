'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ValidationErrors } from '@/utils/formAction';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import {
  accorderDemandeDélaiAction,
  AccorderDemandeDélaiFormKeys,
} from './accorderDemandeDélai.action';

type AccorderDemandeDélaiFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDemande: DateTime.RawType;
  dateAchèvementPrévisionnelActuelle: PlainType<Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType>;
  nombreDeMois: number;
};

export const AccorderDemandeDélai = ({
  identifiantProjet,
  dateDemande,
  nombreDeMois,
  dateAchèvementPrévisionnelActuelle,
}: AccorderDemandeDélaiFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderDemandeDélaiFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  const dateActuelle = Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
    dateAchèvementPrévisionnelActuelle,
  );

  const [nouvelleDate, setNouvelleDate] = useState(dateActuelle.ajouterDélai(nombreDeMois));

  const laNouvelleDateEstValide = () => nouvelleDate.dateTime.estUltérieureÀ(dateActuelle.dateTime);

  const ajouterDélaiÀLaDateActuelle = (nombreDeMois: number) => {
    const nouvelleDate = dateActuelle.ajouterDélai(nombreDeMois);

    setNouvelleDate(nouvelleDate);
  };

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
        id="accorder-demande-délai"
        title="Accorder la demande de délai"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
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
                {laNouvelleDateEstValide() && (
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

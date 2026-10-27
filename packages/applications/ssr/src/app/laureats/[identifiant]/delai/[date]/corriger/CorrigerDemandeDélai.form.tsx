'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { type FC, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';
import {
  type CorrigerDemandeDélaiFormKeys,
  corrigerDemandeDélaiAction,
} from './corrigerDemandeDélai.action';

export type CorrigerDemandeDélaiFormProps = {
  identifiantProjet: string;
  demande: PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>;
  dateAchèvementPrévisionnelActuelle: PlainType<Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType>;
};

export const CorrigerDemandeDélaiForm: FC<CorrigerDemandeDélaiFormProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelActuelle,
  demande: { demandéLe, nombreDeMois, pièceJustificative, raison, motif },
}) => {
  const dateActuelle = Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
    dateAchèvementPrévisionnelActuelle,
  );

  const [nouvelleDate, setNouvelleDate] = useState(dateActuelle.ajouterDélai(nombreDeMois));
  const [nouveauMotif, setNouveauMotif] = useState<Lauréat.Délai.MotifDemandeDélai.RawType>(
    motif.motif,
  );

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerDemandeDélaiFormKeys>
  >({});

  const peutDemanderUnDélai = () => nouvelleDate.dateTime.estUltérieureÀ(dateActuelle.dateTime);

  const ajouterDélaiÀLaDateActuelle = (nombreDeMois: number) => {
    const nouvelleDate = dateActuelle.ajouterDélai(nombreDeMois);

    setNouvelleDate(nouvelleDate);
  };

  const afficherNouvelleDateAchèvement =
    peutDemanderUnDélai() && nouveauMotif === 'prolongation-délai-achèvement';

  return (
    <Form
      action={corrigerDemandeDélaiAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Corriger',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <input type={'hidden'} value={demandéLe.date} name="dateDemande" />

      <div>
        <Select
          state={validationErrors['motif'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['motif']}
          id="motif"
          label="Motif de la demande de délai"
          className="w-full"
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
          hintText="Veuillez saisir une durée de délai en mois, avec au minimum 1 mois"
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
            Après accord de votre demande de délai, la date d'achèvement prévisionnel serait le{' '}
            <FormattedDate date={nouvelleDate.formatter()} className="font-semibold" />
          </div>
        )}
      </div>

      <Input
        textArea
        label="Raison"
        id="raison"
        className="w-full md:w-1/2"
        hintText="Veuillez détailler les raisons de ce changement"
        nativeTextAreaProps={{
          name: 'raison',
          required: true,
          defaultValue: raison,
          'aria-required': true,
        }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative"
        name="pieceJustificative"
        hintText="Veuillez joindre vos justificatifs"
        documentKeys={[DocumentProjet.bind(pièceJustificative).formatter()]}
        formats={['pdf']}
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};

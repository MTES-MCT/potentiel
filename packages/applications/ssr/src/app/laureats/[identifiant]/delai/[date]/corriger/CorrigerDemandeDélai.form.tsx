'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { type FC, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';
import { InfoDateAchèvementPrévisionnelAprèsDélaiAccordé } from '../InfoDateAchèvementPrévisionnelAprèsDélaiAccordé';
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
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerDemandeDélaiFormKeys>
  >({});

  const peutDemanderUnDélai = () => nouvelleDate.dateTime.estUltérieureÀ(dateActuelle.dateTime);

  const ajouterDélaiÀLaDateActuelle = (nombreDeMois: number) => {
    const nouvelleDate = dateActuelle.ajouterDélai(nombreDeMois);

    setNouvelleDate(nouvelleDate);
  };

  const afficherNouvelleDateAchèvement =
    peutDemanderUnDélai() && motif.motif === 'prolongation-délai-achèvement';

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

      <div>Motif : {getMotifDemandeDélaiLabel(motif.motif)}</div>
      <div>
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
          <InfoDateAchèvementPrévisionnelAprèsDélaiAccordé
            nouvelleDate={nouvelleDate.formatter()}
          />
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

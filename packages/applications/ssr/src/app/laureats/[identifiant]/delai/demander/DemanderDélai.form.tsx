'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { type FC, useState } from 'react';

import type { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { getMotifDemandeDélaiLabel } from '../_helpers/getMotifDemandeDélaiLabel';
import { InfoBoxDateAchèvementPrévisionnel } from '../InfoBoxDateAchèvementPrévisionnel';
import { InfoBoxDemandeDélai } from '../InfoBoxDemandeDélai';
import { type DemanderDélaiFormKeys, demanderDélaiAction } from './DemanderDélai.action';

export type DemanderDélaiFormProps = {
  identifiantProjet: string;
  dateAchèvementPrévisionnelActuelle: PlainType<Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType>;
};

export const DemanderDélaiForm: FC<DemanderDélaiFormProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelActuelle,
}) => {
  const dateActuelle = Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
    dateAchèvementPrévisionnelActuelle,
  );

  const [motif, setMotif] = useState<Lauréat.Délai.MotifDemandeDélai.RawType>();

  const [nouvelleDate, setNouvelleDate] = useState<DateTime.ValueType>(dateActuelle.dateTime);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors<DemanderDélaiFormKeys>>(
    {},
  );

  const peutDemanderUnDélai = () => nouvelleDate.estUltérieureÀ(dateActuelle.dateTime);

  const ajouterDélaiÀLaDateActuelle = (nombreDeMois: number) => {
    const nouvelleDate = dateActuelle.ajouterDélai(nombreDeMois);

    setNouvelleDate(nouvelleDate.dateTime);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-6 justify-between">
      <div>
        <InfoBoxDateAchèvementPrévisionnel
          dateAchèvementPrévisionnelActuelle={dateAchèvementPrévisionnelActuelle}
        />
        <Form
          action={demanderDélaiAction}
          onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
          actionButtons={{
            submitLabel: 'Demander',
            secondaryAction: {
              type: 'back',
            },
          }}
        >
          <div>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <Select
              state={validationErrors['motif'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['motif']}
              id="motif"
              label="Motif de la demande de délai"
              className="w-full"
              nativeSelectProps={{
                name: 'motif',
                required: true,
                value: motif,
                onChange: (e) => setMotif(e.target.value),
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
              className="w-full"
              nativeInputProps={{
                min: '1',
                name: 'nombreDeMois',
                required: true,
                'aria-required': true,
                type: 'number',
                inputMode: 'numeric',
                pattern: '[1-9]*',
                onChange: (e) => ajouterDélaiÀLaDateActuelle(Number(e.target.value)),
              }}
              state={validationErrors['nombreDeMois'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['nombreDeMois']}
            />

            {peutDemanderUnDélai() && (
              <div>
                Après accord de votre demande de délai, la date d'achèvement prévisionnel serait le{' '}
                <FormattedDate date={nouvelleDate.formatter()} className="font-semibold" />
              </div>
            )}
            <Input
              textArea
              label="Raison"
              id="raison"
              className="w-full"
              hintText="Veuillez détailler les raisons de ce changement"
              nativeTextAreaProps={{
                name: 'raison',
                required: true,
                'aria-required': true,
              }}
              state={validationErrors['raison'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['raison']}
            />

            <UploadNewOrModifyExistingDocument
              label="Pièce justificative"
              name="pieceJustificative"
              hintText="Veuillez joindre vos justificatifs"
              formats={['pdf']}
              required
              state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['pieceJustificative']}
            />
          </div>
        </Form>
      </div>
      <div className="flex-1 flex flex-col gap-8 mt-42">
        {motif && <InfoBoxDemandeDélai motif={motif} className="md:mt-32" />}
      </div>
    </div>
  );
};

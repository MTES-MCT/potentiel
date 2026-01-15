'use client';

import React, { useState } from 'react';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { FormAlertError } from '@/components/atoms/form/FormAlertError';

import {
  choisirCahierDesChargesAction,
  ChoisirCahierDesChargesFormKeys,
} from './choisirCahierDesCharges.action';

export type ChoisirCahierDesChargesFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  cahierDesCharges: PlainType<Lauréat.ConsulterCahierDesChargesReadModel>;
  cahiersDesChargesDisponibles: {
    label: string;
    value: AppelOffre.RéférenceCahierDesCharges.RawType;
    descriptions?: string[];
    disabled?: boolean;
  }[];
  aBénéficiéDuDélaiCDC2022: boolean;
};

export const ChoisirCahierDesChargesForm: React.FC<ChoisirCahierDesChargesFormProps> = ({
  identifiantProjet,
  cahierDesCharges,
  cahiersDesChargesDisponibles,
  aBénéficiéDuDélaiCDC2022,
}) => {
  const cdcActuel = AppelOffre.RéférenceCahierDesCharges.bind(
    cahierDesCharges.cahierDesChargesModificatif ?? { type: 'initial' },
  );
  const [cdcChoisi, setCdcChoisi] = useState(cdcActuel);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ChoisirCahierDesChargesFormKeys>
  >({});

  const showAlerteDélaiCdc2022 =
    aBénéficiéDuDélaiCDC2022 && cdcActuel.estCDC2022() && !cdcChoisi.estCDC2022();

  return (
    <Form
      action={choisirCahierDesChargesAction}
      heading="Choisir un nouveau cahier des charges"
      onValidationError={setValidationErrors}
      pendingModal={{
        id: 'form-choix-cdc',
        title: 'Choix du cahier des charges',
        children: 'Modification du cahier des charges du projet en cours...',
      }}
      actionButtons={{
        submitLabel: 'Choisir',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <div className="flex flex-col gap-4 mt-4">
        <RadioButtons
          name="cahierDesCharges"
          options={cahiersDesChargesDisponibles.map((cdc) => ({
            label: cdc.label,
            nativeInputProps: {
              value: cdc.value,
              onChange: () =>
                setCdcChoisi(AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(cdc.value)),
              checked: cdc.value === cdcChoisi.formatter(),
              required: true,
              'aria-required': true,
              disabled: cdc.disabled,
            },
            hintText: cdc.descriptions ? (
              <ul>
                {cdc.descriptions.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            ) : null,
          }))}
          state={validationErrors['cahierDesCharges'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['cahierDesCharges']}
        />

        {showAlerteDélaiCdc2022 && (
          <Alert
            severity="warning"
            small
            className="mb-4"
            description={
              <>
                <div>
                  Le cahier des charges que vous sélectionnez ne permet plus au projet de bénéficier
                  du délai relatif au cahier des charges modificatif du 30/08/2022.{' '}
                </div>

                <div className="font-bold">
                  Si vous validez ce changement de cahier des charges, la date limite d'achèvement
                  du projet sera impactée.
                </div>
              </>
            }
          />
        )}

        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
        {validationErrors['identifiantProjet'] && (
          <FormAlertError description={validationErrors['identifiantProjet']} />
        )}
      </div>
    </Form>
  );
};

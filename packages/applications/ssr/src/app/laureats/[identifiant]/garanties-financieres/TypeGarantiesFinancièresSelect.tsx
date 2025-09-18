import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ValidationErrors } from '@/utils/formAction';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

export type GarantiesFinancièresFormInputsProps = {
  id: string;
  name: string;
  label?: string;
  validationErrors: ValidationErrors;
  actuelles?: Partial<
    PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>
  >;
  typesGarantiesFinancières: Array<{
    label: string;
    value: Candidature.TypeGarantiesFinancières.RawType;
  }>;
};

export const GarantiesFinancièresFormInputs: FC<GarantiesFinancièresFormInputsProps> = ({
  id,
  name,
  label = 'Type des garanties financières',
  validationErrors,
  actuelles,
  typesGarantiesFinancières,
}) => {
  const typeActuel = actuelles?.garantiesFinancières
    ? Lauréat.GarantiesFinancières.GarantiesFinancières.bind(actuelles.garantiesFinancières)
    : undefined;
  const [typeSélectionné, setTypeSélectionné] = useState<
    Candidature.TypeGarantiesFinancières.RawType | undefined
  >(typeActuel?.type.type);

  return (
    <>
      <Select
        id={id}
        label={label}
        nativeSelectProps={{
          name,
          value: typeSélectionné,
          onChange: (e) => setTypeSélectionné(e.target.value),
          'aria-required': true,
          required: true,
        }}
        placeholder="Sélectionnez le type de garanties financières"
        options={typesGarantiesFinancières}
        state={validationErrors['type'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['type']}
      />

      {typeSélectionné === 'avec-date-échéance' && (
        <InputDate
          label="Date d'échéance"
          name="dateEcheance"
          required
          defaultValue={
            typeActuel?.estAvecDateÉchéance() ? typeActuel.dateÉchéance.formatter() : undefined
          }
          state={validationErrors['dateEcheance'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['dateEcheance']}
        />
      )}

      <InputDate
        label={typeSélectionné === 'exemption' ? 'Date de délibération' : 'Date de constitution'}
        name="dateConstitution"
        max={DateTime.now().formatter()}
        defaultValue={actuelles?.dateConstitution?.date}
        required
        state={validationErrors['dateConstitution'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateConstitution']}
      />

      <UploadNewOrModifyExistingDocument
        label={
          typeSélectionné === 'exemption'
            ? 'Délibération approuvant le projet objet de l’offre'
            : 'Attestation de constitution'
        }
        name="attestation"
        required
        formats={['pdf']}
        state={validationErrors['attestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['attestation']}
        documentKeys={
          actuelles?.attestation ? [DocumentProjet.bind(actuelles.attestation).formatter()] : []
        }
      />
    </>
  );
};

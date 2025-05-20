import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { FieldValidationErrors } from '../../ModifierLauréat.form';

type AttestationFieldProps = {
  validationErrors: FieldValidationErrors;
};

export const AttestationField = ({ validationErrors }: AttestationFieldProps) => (
  <div className="flex flex-col">
    <div className="flex-1 flex flex-row gap-1">
      <span className="font-semibold">
        Attestation de désignation (optionnel si la candidature n'est pas corrigée)
      </span>
    </div>
    <RadioButtons
      state={validationErrors['doitRegenererAttestation'] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors['doitRegenererAttestation']}
      hintText="Attention, vous ne pourrez pas régénérer l'attestation si la candidature n'est pas corrigée"
      legend=""
      orientation="horizontal"
      options={[
        {
          label: "Je souhaite régénérer l'attestation",
          nativeInputProps: {
            name: 'doitRegenererAttestation',
            value: 'true',
          },
        },
        {
          label: "Je ne souhaite pas régénérer l'attestation",
          nativeInputProps: {
            name: 'doitRegenererAttestation',
            value: 'false',
          },
        },
      ]}
    />
  </div>
);

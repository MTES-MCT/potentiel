import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { FieldValidationErrors } from '../../ModifierLauréat.form';

type AttestationFieldProps = {
  validationErrors: FieldValidationErrors;
};

export const AttestationField = ({ validationErrors }: AttestationFieldProps) => (
  <div className="flex flex-col">
    <div className="flex-1 flex flex-row gap-1">
      <span className="font-semibold">Attestation de désignation</span>
      <span>(optionnel sauf en cas de modification de la candidature)</span>
    </div>
    <RadioButtons
      state={validationErrors['candidature.doitRegenererAttestation'] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors['candidature.doitRegenererAttestation']}
      legend=""
      orientation="horizontal"
      options={[
        {
          label: "Je souhaite régénérer l'attestation",
          nativeInputProps: {
            name: 'candidature.doitRegenererAttestation',
            value: 'true',
          },
        },
        {
          label: "Je ne souhaite pas régénérer l'attestation",
          nativeInputProps: {
            name: 'candidature.doitRegenererAttestation',
            value: 'false',
          },
        },
      ]}
    />
  </div>
);

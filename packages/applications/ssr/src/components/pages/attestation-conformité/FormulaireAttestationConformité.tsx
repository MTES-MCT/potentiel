import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { transmettreAttestationConformitéAction } from './transmettre/transmettreAttestationConformité.action';
import { modifierAttestationConformitéAction } from './modifier/modifierAttestationConformité.action';

type Action =
  | typeof transmettreAttestationConformitéAction
  | typeof modifierAttestationConformitéAction;

export type FormulaireAttestationConformitéProps = {
  identifiantProjet: string;
  action: Action;
  submitButtonLabel: string;
  donnéesActuelles?: {
    attestation: string;
    preuveTransmissionAuCocontractant: string;
    dateTransmissionAuCocontractant: Iso8601DateTime;
  };
  showDemanderMainlevée?: boolean;
};

export const FormulaireAttestationConformité: FC<FormulaireAttestationConformitéProps> = ({
  identifiantProjet,
  action,
  submitButtonLabel,
  donnéesActuelles,
  showDemanderMainlevée,
}) => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  const router = useRouter();

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={action}
      onSuccess={() => router.push(Routes.Projet.details(identifiantProjet))}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <div className="flex flex-col gap-6">
        <UploadDocument
          name="attestation"
          required
          documentKey={donnéesActuelles?.attestation}
          label="Attestation de conformité"
          state={validationErrors.includes('attestation') ? 'error' : 'default'}
        />
        <Alert
          severity="info"
          small
          description={
            <p className="p-3">
              Vous devez transmettre sur Potentiel la preuve, ainsi que la date de transmission au
              co-contractant, car d'après les cahiers des charges, l'achèvement ou date d’achèvement
              est la :
              <br />
              <span className="italic">
                Date de fourniture au cocontractant de l’attestation de conformité mentionnée à
                l’article R. 311-27-1 du code de l’énergie.
              </span>
            </p>
          }
        />

        <UploadDocument
          name="preuveTransmissionAuCocontractant"
          required
          documentKey={donnéesActuelles?.attestation}
          label="Preuve de transmission au co-contractant"
          stateRelatedMessage="Il peut s'agir d'une copie de l'email que vous lui avez envoyé, ou de la copie du courrier si envoyé par voie postale."
          state={
            validationErrors.includes('preuveTransmissionAuCocontractant') ? 'error' : 'default'
          }
        />

        <InputDate
          label="Date de transmission au co-contractant"
          nativeInputProps={{
            type: 'date',
            name: 'dateTransmissionAuCocontractant',
            max: now(),
            required: true,
            'aria-required': true,
            defaultValue: donnéesActuelles?.dateTransmissionAuCocontractant,
          }}
          state={validationErrors.includes('dateTransmissionAuCocontractant') ? 'error' : 'default'}
          stateRelatedMessage="Date de transmission au co-contractant obligatoire"
        />

        {showDemanderMainlevée && (
          <Checkbox
            id="demanderMainlevee"
            state={validationErrors.includes('demanderMainlevee') ? 'error' : 'default'}
            options={[
              {
                label: `Je souhaite demander une mainlevée de mes garanties financières`,
                nativeInputProps: {
                  name: 'demanderMainlevee',
                  value: 'true',
                },
              },
            ]}
          />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-5">
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.Projet.details(identifiantProjet),
          }}
          iconId="fr-icon-arrow-left-line"
        >
          Retour sur le projet
        </Button>
        <SubmitButton>{submitButtonLabel}</SubmitButton>
      </div>
    </Form>
  );
};

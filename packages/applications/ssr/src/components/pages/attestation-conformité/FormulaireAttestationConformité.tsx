import { FC, useState } from 'react';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';

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
};

export const FormulaireAttestationConformité: FC<FormulaireAttestationConformitéProps> = ({
  identifiantProjet,
  action,
  submitButtonLabel,
  donnéesActuelles,
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

      <div className="flex flex-col gap-8">
        <Upload
          label={
            <>
              Attestation de conformité
              {donnéesActuelles?.attestation && (
                <>
                  <br />
                  <small>
                    Vous pouvez joindre un nouveau fichier ou bien télécharger et renvoyer le
                    fichier actuel (
                    <Link
                      href={Routes.Document.télécharger(donnéesActuelles.attestation)}
                      target="_blank"
                    >
                      télécharger le fichier actuel
                    </Link>
                    )
                  </small>
                </>
              )}
            </>
          }
          hint="Format accepté : pdf"
          nativeInputProps={{
            name: 'attestation',
            required: true,
            'aria-required': true,
            accept: '.pdf',
          }}
          state={validationErrors.includes('attestation') ? 'error' : 'default'}
          stateRelatedMessage="Attestation de conformité obligatoire"
        />
        <Upload
          label={
            <>
              Preuve de transmission au co-contractant
              {donnéesActuelles?.preuveTransmissionAuCocontractant && (
                <>
                  <br />
                  <small>
                    Vous pouvez joindre un nouveau fichier ou bien télécharger et renvoyer le
                    fichier actuel (
                    <Link
                      href={Routes.Document.télécharger(
                        donnéesActuelles.preuveTransmissionAuCocontractant,
                      )}
                      target="_blank"
                    >
                      télécharger le fichier actuel
                    </Link>
                    )
                  </small>
                </>
              )}
            </>
          }
          hint="Il peut s'agir d'une copie de l'email que vous lui avez envoyé, ou de la copie du courrier si envoyé par voie postale. Format accepté : pdf"
          nativeInputProps={{
            name: 'preuveTransmissionAuCocontractant',
            required: true,
            'aria-required': true,
            accept: '.pdf',
          }}
          state={
            validationErrors.includes('preuveTransmissionAuCocontractant') ? 'error' : 'default'
          }
          stateRelatedMessage="Preuve de transmission au co-contractant obligatoire"
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

import { FC } from 'react';
import Download from '@codegouvfr/react-dsfr/Download';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';

import { CallOut } from '@/components/atoms/CallOut';
import { formatDateForText } from '@/utils/formatDateForText';

export type GarantiesFinancièresActuellesProps = {
  identifiantProjet: string;
  actuelles: {
    type: string;
    dateÉchéance?: string;
    dateConstitution?: string;
    attestation?: string;
    dateValidation: string;
    dateEnvoi: string;
    action?: 'modifier' | 'enregister-attestation';
  };
};

export const GarantiesFinancièresActuelles: FC<GarantiesFinancièresActuellesProps> = ({
  identifiantProjet,
  actuelles: { type, dateÉchéance, dateConstitution, attestation, action },
}) => (
  <CallOut
    title="Garanties financières actuelles"
    className="w-1/2"
    colorVariant={action === 'enregister-attestation' ? 'warning' : 'info'}
    content={
      <>
        <div className="mt-5 gap-2">
          <div>
            Type : <span className="font-semibold">{type}</span>
          </div>
          {dateÉchéance && (
            <div>
              Date d'échéance :{' '}
              <span className="font-semibold">{formatDateForText(dateÉchéance)}</span>
            </div>
          )}
          {dateConstitution && (
            <div>
              Date de constitution :{' '}
              <span className="font-semibold">{formatDateForText(dateConstitution)}</span>
            </div>
          )}
          <div>
            {attestation && (
              <Download
                details="fichier au format pdf"
                label="Télécharger l'attestation"
                linkProps={{ href: Routes.Document.télécharger(attestation) }}
              />
            )}
          </div>
        </div>
        <ButtonAction identifiantProjet={identifiantProjet} action={action} />
      </>
    }
  />
);

type ButtonActionProps = {
  identifiantProjet: GarantiesFinancièresActuellesProps['identifiantProjet'];
  action: GarantiesFinancièresActuellesProps['actuelles']['action'];
};
const ButtonAction: FC<ButtonActionProps> = ({ identifiantProjet, action }) => {
  switch (action) {
    case 'modifier':
      return (
        <Button
          linkProps={{
            href: Routes.GarantiesFinancières.modifier(identifiantProjet),
          }}
        >
          Modifier
        </Button>
      );
    case 'enregister-attestation':
      return (
        <>
          <p className="italic">
            Les garanties financières sont incomplètes, merci de les compléter en enregistrant
            l'attestation de constitution
          </p>

          <Button
            linkProps={{
              href: Routes.GarantiesFinancières.enregistrerAttestation(identifiantProjet),
            }}
          >
            Enregistrer l'attestation de constitution
          </Button>
        </>
      );
    default:
      return null;
  }
};

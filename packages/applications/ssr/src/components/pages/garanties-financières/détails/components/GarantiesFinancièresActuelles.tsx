import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
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
    action?: 'modifier';
  };
};
export const GarantiesFinancièresActuelles: FC<GarantiesFinancièresActuellesProps> = ({
  identifiantProjet,
  actuelles: { type, dateÉchéance, dateConstitution, attestation, action },
}) => (
  <>
    {!attestation ||
      (!dateConstitution && (
        <Alert
          className="mb-4"
          severity="warning"
          description={
            <>
              Les garanties financières sont incomplètes, merci de les compléter en suivant{' '}
              <Link href={Routes.GarantiesFinancières.compléter(identifiantProjet)}>ce lien</Link>
            </>
          }
          small
        />
      ))}

    <CallOut
      title="Garanties financières actuelles"
      iconId="ri-information-line"
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
          {action && action === 'modifier' && (
            <Button
              linkProps={{
                href: Routes.GarantiesFinancières.compléter(identifiantProjet),
              }}
            >
              Modifier
            </Button>
          )}
        </>
      }
    />
  </>
);

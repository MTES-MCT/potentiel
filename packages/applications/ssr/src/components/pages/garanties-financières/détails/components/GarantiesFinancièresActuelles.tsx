import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { CallOut } from '@/components/atoms/CallOut';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';

export type GarantiesFinancièresActuelles = {
  type: string;
  dateÉchéance?: Iso8601DateTime;
  dateConstitution?: Iso8601DateTime;
  attestation?: string;
  validéLe?: Iso8601DateTime;
  soumisLe?: Iso8601DateTime;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
    par?: string;
  };
};

export type GarantiesFinancièresActuellesProps = {
  identifiantProjet: string;
  actuelles: GarantiesFinancièresActuelles & {
    action?: 'modifier' | 'enregister-attestation';
  };
};

export const GarantiesFinancièresActuelles: FC<GarantiesFinancièresActuellesProps> = ({
  identifiantProjet,
  actuelles: {
    type,
    dateÉchéance,
    dateConstitution,
    attestation,
    action,
    validéLe,
    soumisLe,
    dernièreMiseÀJour,
  },
}) => (
  <>
    <CallOut
      className="flex-1"
      colorVariant={action === 'enregister-attestation' ? 'warning' : 'success'}
      content={
        <>
          <Heading2>Garanties financières actuelles</Heading2>
          <div className="text-xs italic">
            Dernière mise à jour le{' '}
            <FormattedDate className="font-semibold" date={dernièreMiseÀJour.date} />
            {dernièreMiseÀJour.par && (
              <>
                {' '}
                par <span className="font-semibold">{dernièreMiseÀJour.par}</span>
              </>
            )}
          </div>
          <div className="mt-5 gap-2 text-base">
            <div>
              {type && (
                <>
                  Type : <span className="font-semibold">{type}</span>
                </>
              )}
              {!type && action === 'modifier' && (
                <span className="font-semibold italic">Type de garanties financières manquant</span>
              )}
              {!type && action !== 'modifier' && (
                <span className="font-semibold italic">
                  Type à compléter par l'autorité instructrice compétente
                </span>
              )}
            </div>
            {dateÉchéance && (
              <div>
                Date d'échéance : <FormattedDate className="font-semibold" date={dateÉchéance} />
              </div>
            )}
            {dateConstitution && (
              <div>
                Date de constitution :{' '}
                <FormattedDate className="font-semibold" date={dateConstitution} />
              </div>
            )}
            {validéLe && (
              <div>
                Validé le : <FormattedDate className="font-semibold" date={validéLe} />
              </div>
            )}
            {soumisLe && (
              <div>
                Soumis le : <FormattedDate className="font-semibold" date={soumisLe} />
              </div>
            )}
            <div>
              {attestation && (
                <Download
                  details="fichier au format pdf"
                  label="Télécharger l'attestation"
                  linkProps={{
                    href: Routes.Document.télécharger(attestation),
                    target: '_blank',
                  }}
                />
              )}
            </div>
          </div>
          <ButtonAction identifiantProjet={identifiantProjet} action={action} />
        </>
      }
    />
  </>
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
            href: Routes.GarantiesFinancières.actuelles.modifier(identifiantProjet),
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
              href: Routes.GarantiesFinancières.actuelles.enregistrerAttestation(identifiantProjet),
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

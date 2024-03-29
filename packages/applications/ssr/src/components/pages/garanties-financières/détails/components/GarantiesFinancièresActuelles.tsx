import { FC } from 'react';
import Download from '@codegouvfr/react-dsfr/Download';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';

import { CallOut } from '@/components/atoms/CallOut';
import { formatDateForText } from '@/utils/formatDateForText';
import { Heading2 } from '@/components/atoms/headings';

export type GarantiesFinancièresActuelles = {
  type: string;
  dateÉchéance?: string;
  dateConstitution?: string;
  attestation?: string;
  validéLe?: string;
  soumisLe?: string;
  dernièreMiseÀJour: {
    date: string;
    par: string;
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
      colorVariant={action === 'enregister-attestation' ? 'warning' : 'sucess'}
      content={
        <>
          <Heading2>Garanties financières actuelles</Heading2>
          <div className="text-xs italic">
            Dernière mise à jour le{' '}
            <span className="font-semibold">{formatDateForText(dernièreMiseÀJour.date)}</span> par{' '}
            <span className="font-semibold">{dernièreMiseÀJour.par}</span>
          </div>
          <div className="mt-5 gap-2 text-base">
            <div>
              {type ? (
                <>
                  Type : <span className="font-semibold">{type}</span>
                </>
              ) : action === 'modifier' ? (
                <>
                  Type de garanties financières manquant (
                  <a href={Routes.GarantiesFinancières.actuelles.modifier(identifiantProjet)}>
                    compléter
                  </a>
                  )
                </>
              ) : (
                <span className="font-semibold italic">
                  Type à compléter par l'autorité instructrice compétente
                </span>
              )}
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
            {validéLe && (
              <div>
                Validé le : <span className="font-semibold">{formatDateForText(validéLe)}</span>
              </div>
            )}
            {soumisLe && (
              <div>
                Soumis le : <span className="font-semibold">{formatDateForText(soumisLe)}</span>
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
          priority="secondary"
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

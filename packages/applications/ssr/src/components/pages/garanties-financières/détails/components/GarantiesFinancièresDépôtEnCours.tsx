import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { CallOut } from '@/components/atoms/CallOut';
import { Heading2 } from '@/components/atoms/headings';
import { displayDate } from '@/utils/displayDate';

import { DépôtGarantiesFinancières } from './GarantiesFinancièresHistoriqueDépôts';

type GarantiesFinancièresDépôtEnCoursProps = {
  dépôt: DépôtGarantiesFinancières & { action?: 'modifier' | 'instruire' };
  identifiantProjet: string;
};

export const GarantiesFinancièresDépôtEnCours: FC<GarantiesFinancièresDépôtEnCoursProps> = ({
  identifiantProjet,
  dépôt: { type, dateÉchéance, dateConstitution, attestation, action, dernièreMiseÀJour },
}) => (
  <>
    <CallOut
      className="flex-1"
      colorVariant={'info'}
      content={
        <div className="flex flex-col h-full">
          <Heading2>Garanties financières à traiter</Heading2>
          <div className="text-xs italic">
            Dernière mise à jour le{' '}
            <span className="font-semibold">{displayDate(dernièreMiseÀJour.date)}</span> par{' '}
            <span className="font-semibold">{dernièreMiseÀJour.par}</span>
          </div>
          <div className="mt-5 gap-2 text-base">
            {type ? (
              <>
                Type : <span className="font-semibold">{type}</span>
              </>
            ) : action === 'modifier' || action === 'instruire' ? (
              <>
                Type de garanties financières manquant (
                <a href={Routes.GarantiesFinancières.dépôt.modifier(identifiantProjet)}>
                  compléter
                </a>
                )
              </>
            ) : (
              <span className="font-semibold italic">Type à compléter</span>
            )}
            {dateÉchéance && (
              <div>
                Date d'échéance : <span className="font-semibold">{displayDate(dateÉchéance)}</span>
              </div>
            )}
            {dateConstitution && (
              <div>
                Date de constitution :{' '}
                <span className="font-semibold">{displayDate(dateConstitution)}</span>
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
          {action && (
            <Button
              className="mt-auto w-fit"
              linkProps={{
                href: Routes.GarantiesFinancières.dépôt.modifier(identifiantProjet),
              }}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </Button>
          )}
        </div>
      }
    />
  </>
);

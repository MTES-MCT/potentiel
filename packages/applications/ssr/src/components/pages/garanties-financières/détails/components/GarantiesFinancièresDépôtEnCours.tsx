import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { CallOut } from '@/components/atoms/CallOut';
import { Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { ValiderDépôtEnCoursGarantiesFinancières } from '../../dépôt/modifier/valider/validerDépôtEnCoursGarantiesFinancières';
import { SupprimerDépôtEnCoursGarantiesFinancières } from '../../dépôt/modifier/supprimer/SupprimerDépôtEnCoursGarantiesFinancières';

import { DépôtGarantiesFinancières } from './GarantiesFinancièresHistoriqueDépôts';

export type GarantiesFinancièresDépôtEnCoursProps = {
  dépôt: DépôtGarantiesFinancières & { actions: Array<'modifier' | 'instruire' | 'supprimer'> };
  identifiantProjet: string;
};

export const GarantiesFinancièresDépôtEnCours: FC<GarantiesFinancièresDépôtEnCoursProps> = ({
  identifiantProjet,
  dépôt: { type, dateÉchéance, dateConstitution, attestation, actions, dernièreMiseÀJour },
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
            <FormattedDate className="font-semibold" date={dernièreMiseÀJour.date} /> par{' '}
            <span className="font-semibold">{dernièreMiseÀJour.par}</span>
          </div>
          <div className="mt-5 gap-2 text-base">
            {type ? (
              <>
                Type : <span className="font-semibold">{type}</span>
              </>
            ) : actions?.includes('modifier') ? (
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
                Date d'échéance : <FormattedDate className="font-semibold" date={dateÉchéance} />
              </div>
            )}
            {dateConstitution && (
              <div>
                Date de constitution :{' '}
                <FormattedDate className="font-semibold" date={dateConstitution} />
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
          <div className="flex md:flex-row flex-col gap-4">
            {actions?.includes('modifier') && (
              <Button
                priority="secondary"
                linkProps={{
                  href: Routes.GarantiesFinancières.dépôt.modifier(identifiantProjet),
                }}
              >
                Modifier
              </Button>
            )}
            {actions?.includes('instruire') && (
              <ValiderDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
            )}
            {actions?.includes('supprimer') && (
              <SupprimerDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
            )}
          </div>
        </div>
      }
    />
  </>
);

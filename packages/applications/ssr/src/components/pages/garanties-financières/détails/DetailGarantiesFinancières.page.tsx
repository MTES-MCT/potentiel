'use client';

import { FC } from 'react';
import { CallOut } from '@codegouvfr/react-dsfr/CallOut';
import Link from 'next/link';
import { fr } from '@codegouvfr/react-dsfr';
import Download from '@codegouvfr/react-dsfr/Download';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { Heading2 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { formatDateForText } from '@/utils/formatDateForText';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
import { StatutGarantiesFinancièresBadge } from '../StatutGarantiesFinancièresBadge';
import { StatutDépôtGarantiesFinancièresBadge } from '../StatutDépôtGarantiesFinancièresBadge';

export type DépôtStatut = 'en-cours' | 'validé' | 'rejeté';

/*
identifiantProjet: string;
    nomProjet: string;
    régionProjet: Array<string>;
    appelOffre: string;
    période: string;
    famille?: string;

    statut: string;
    misÀJourLe: string;

    actuelles?: {
      type: string;
      dateÉchéance?: string;
      dateConstitution: string;
      attestation: string;
    };
    dateLimiteSoumission?: string;

    soumissions: [
      {
        type: string;
        dateÉchéance?: string;

        statut: 'en-cours' | 'validé' | 'rejeté';

        dateConstitution: string;
        soumisLe: string;
        attestation: string;

        validation?: { le: string; par: string };
        rejet?: { le: string; par: string };
      },
    ];
*/

export type DetailGarantiesFinancièresPageProps = {
  projet: ProjetBannerProps;
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
  actuelles?: {
    type: GarantiesFinancières.TypeGarantiesFinancières.RawType;
    typeLabel: string;
    dateÉchéance?: string;
    dateConstitution: string;
    attestation: string;
  };
  dateLimiteSoummission?: string;
  dépôts: Array<{
    type: GarantiesFinancières.TypeGarantiesFinancières.RawType;
    typeLabel: string;
    dateÉchéance?: string;
    statut: DépôtStatut;
    dateConstitution: string;
    déposéLe: string;
    attestation: string;
    validation?: { validéLe: string; validéPar: string };
    rejet?: { rejetéLe: string; rejetéPar: string };
  }>;
  misÀJourLe: string;
};

const getTimelineItemStatus = (statut: DépôtStatut): TimelineItemProps['status'] => {
  switch (statut) {
    case 'en-cours':
      return 'info';
    case 'validé':
      return 'success';
    case 'rejeté':
      return 'error';
  }
};

export const DetailGarantiesFinancièresPage: FC<DetailGarantiesFinancièresPageProps> = ({
  projet,
  statut,
  actuelles,
  dateLimiteSoummission,
  dépôts,
  misÀJourLe,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageGarantiesFinancières
      title={
        <>
          Garanties financières <StatutGarantiesFinancièresBadge statut={statut} />
        </>
      }
    />

    {actuelles && (
      <CallOut title="Garanties financières actuelles">
        <ul className="my-5 gap-2">
          <li>
            Type : <span className="font-bold">{actuelles.typeLabel}</span>
          </li>
          {actuelles.dateÉchéance && (
            <li>Date d'échéance : {formatDateForText(actuelles.dateÉchéance)}</li>
          )}
          <li>Date de constitution : {formatDateForText(actuelles.dateConstitution)}</li>
          <li>
            <Download
              details="fichier au format pdf"
              label="Télécharger l'attestation"
              linkProps={{ href: '#' }}
            />
          </li>
        </ul>
        <Link href={Routes.GarantiesFinancières.modifierValidé(projet.identifiantProjet)}>
          <i className={`${fr.cx('ri-pencil-line', 'fr-icon--lg')} mr-1`} aria-hidden />
          Modifier
        </Link>
      </CallOut>
    )}

    {dépôts.length > 0 && (
      <>
        <Heading2>Soumissions</Heading2>
        <Timeline
          items={dépôts.map((dépôt) => ({
            date: formatDateForText(dépôt.déposéLe),
            status: getTimelineItemStatus(dépôt.statut),
            title: (
              <p>
                Soumission de type <span className="font-bold">{dépôt.typeLabel}</span>{' '}
                <StatutDépôtGarantiesFinancièresBadge statut={dépôt.statut} />
              </p>
            ),
            content: (
              <div className="flex flex-col md:flex-row gap-8 mt-4">
                <ul className="flex-1">
                  {dépôt.dateÉchéance && (
                    <li>Date d'échéance : {formatDateForText(dépôt.dateÉchéance)}</li>
                  )}
                  <li>Date de constitution : {formatDateForText(dépôt.dateConstitution)}</li>
                </ul>
                {dépôt.statut === 'en-cours' && (
                  <Button
                    className="flex md:max-w-lg"
                    iconId="fr-icon-pencil-line"
                    priority="tertiary no outline"
                    linkProps={{
                      href: Routes.GarantiesFinancières.modifierÀTraiter(projet.identifiantProjet),
                    }}
                  >
                    Modifier les garanties financières
                  </Button>
                )}
              </div>
            ),
          }))}
        />
      </>
    )}
  </PageTemplate>
);

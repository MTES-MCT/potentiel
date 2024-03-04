'use client';

import { FC } from 'react';
import Link from 'next/link';
import { fr } from '@codegouvfr/react-dsfr';
import Download from '@codegouvfr/react-dsfr/Download';
import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import { Heading2 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { formatDateForText } from '@/utils/formatDateForText';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
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
  actuelles?: GarantiesFinancièresActuellesProps;
  dateLimiteSoummission?: string;
  dépôts: Array<{
    type: string;
    dateÉchéance?: string;
    statut: DépôtStatut;
    dateConstitution: string;
    déposéLe: string;
    attestation: string;
    validation?: { validéLe: string; validéPar: string };
    rejet?: { rejetéLe: string; rejetéPar: string };
  }>;
  action?: 'soumettre' | 'enregistrer';
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
  actuelles,
  dépôts,
  action,
}) => {
  if (!actuelles && !dépôts.length) {
    return (
      <PageTemplate banner={<ProjetBanner {...projet} />}>
        <TitrePageGarantiesFinancières />

        <div className="flex flex-col gap-8">
          {action === 'soumettre' && (
            <p>
              Aucune garanties financières pour ce projet, vous pouvez en soumettre en{' '}
              <Link
                href={Routes.GarantiesFinancières.soumettre(projet.identifiantProjet)}
                className="font-semibold"
              >
                suivant ce lien
              </Link>
            </p>
          )}

          {action === 'enregistrer' && (
            <p>
              Aucune garanties financières pour ce projet, vous pouvez les enregistrer en{' '}
              <Link
                href={Routes.GarantiesFinancières.enregistrer(projet.identifiantProjet)}
                className="font-semibold"
              >
                suivant ce lien
              </Link>
            </p>
          )}

          <Button
            priority="secondary"
            linkProps={{ href: Routes.Projet.details(projet.identifiantProjet) }}
            className="mt-4"
            iconId="fr-icon-arrow-left-line"
          >
            Retour vers le projet
          </Button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageGarantiesFinancières />

      {actuelles && (
        <>
          {!actuelles.attestation ||
            (!actuelles.dateConstitution && (
              <Alert
                severity="warning"
                description={
                  <>
                    Les garanties financières sont incomplètes, merci de les compléter en suivant{' '}
                    <Link href={Routes.GarantiesFinancières.compléter(projet.identifiantProjet)}>
                      ce lien
                    </Link>
                  </>
                }
                small
              />
            ))}
          <GarantiesFinancièresActuelles
            {...actuelles}
            identifiantProjet={projet.identifiantProjet}
          />
        </>
      )}

      {dépôts.length === 0 && action === 'soumettre' && (
        <Alert
          severity="info"
          small
          description={
            <div className="p-3">
              Vous pouvez{' '}
              <Link
                href={Routes.GarantiesFinancières.soumettre(projet.identifiantProjet)}
                className="font-semibold"
              >
                soumettre de nouvelles garanties financières
              </Link>{' '}
              qui seront validées par l'autorité compétente
            </div>
          }
        />
      )}

      {dépôts.length > 0 && (
        <>
          <Heading2>Soumissions</Heading2>
          <Timeline
            className="mt-4"
            items={dépôts.map((dépôt) => ({
              date: formatDateForText(dépôt.déposéLe),
              status: getTimelineItemStatus(dépôt.statut),
              title: (
                <p>
                  Soumission de type <span className="font-bold">{dépôt.type}</span>
                </p>
              ),
              content: (
                <DépôtGarantiesFinancièresContent
                  dateConstitution={dépôt.dateConstitution}
                  identifiantProjet={projet.identifiantProjet}
                  statut={dépôt.statut}
                  dateÉchéance={dépôt.dateÉchéance}
                />
              ),
            }))}
          />
        </>
      )}
    </PageTemplate>
  );
};

type GarantiesFinancièresActuellesProps = {
  type: string;
  dateÉchéance?: string;
  dateConstitution?: string;
  attestation?: string;
  identifiantProjet: string;
  action?: 'modifier';
};
const GarantiesFinancièresActuelles: FC<GarantiesFinancièresActuellesProps> = ({
  attestation,
  dateConstitution,
  type,
  dateÉchéance,
  identifiantProjet,
  action,
}) => (
  <Alert
    severity="info"
    className="my-4"
    title="Garanties financières actuelles"
    description={
      <>
        <div className="mt-5 gap-2">
          <div>
            Type : <span className="font-bold">{type}</span>
          </div>
          {dateÉchéance && <div>Date d'échéance : {formatDateForText(dateÉchéance)}</div>}
          {dateConstitution && (
            <div>Date de constitution : {formatDateForText(dateConstitution)}</div>
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
        {action === 'modifier' && (
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
);

type DépôtGarantiesFinancièresContentProps = {
  dateÉchéance?: string;
  statut: DépôtStatut;
  dateConstitution: string;
  identifiantProjet: string;
};
const DépôtGarantiesFinancièresContent: FC<DépôtGarantiesFinancièresContentProps> = ({
  statut,
  dateÉchéance,
  dateConstitution,
  identifiantProjet,
}) => (
  <>
    <StatutDépôtGarantiesFinancièresBadge statut={statut} />
    <div className="flex flex-col gap-8 mt-2 mb-6">
      <ul className="flex-1">
        {dateÉchéance && <li>Date d'échéance : {formatDateForText(dateÉchéance)}</li>}
        <li>Date de constitution : {formatDateForText(dateConstitution)}</li>
      </ul>
      {statut === 'en-cours' && (
        <Link
          className="flex md:max-w-lg w-fit"
          href={Routes.GarantiesFinancières.modifierDépôtEnCours(identifiantProjet)}
        >
          <i className={`${fr.cx('ri-pencil-line')} mr-1`} aria-hidden />
          Voir
        </Link>
      )}
    </div>
  </>
);

'use client';

import { FC } from 'react';
import { Accordion } from '@codegouvfr/react-dsfr/Accordion';
import { CallOut } from '@codegouvfr/react-dsfr/CallOut';
import Link from 'next/link';
import { fr } from '@codegouvfr/react-dsfr';
import Download from '@codegouvfr/react-dsfr/Download';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import { List } from '@/components/organisms/List';
import { StatutBadge } from '@/components/molecules/StatutBadge';
import { Heading2 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';

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
};

export const DetailGarantiesFinancièresPage: FC<DetailGarantiesFinancièresPageProps> = ({
  projet,
}) => {
  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageGarantiesFinancières title="Garanties financières" />

      <CallOut title="Garanties financières actuelles">
        <ul className="my-5 gap-2">
          <li>Type : Consignation</li>
          <li>Date d'échéance : 31/01/2025</li>
          <li>Date de constitution : 14/13/2023</li>
          <li>
            Attestation :
            <Download details="pdf" label="Télécharger l'attestation" linkProps={{ href: '#' }} />
          </li>
        </ul>
        <Link href="#">
          <i className={`${fr.cx('ri-pencil-line', 'fr-icon--lg')} mr-1`} aria-hidden />
          Modifier
        </Link>
      </CallOut>

      <div>
        <Heading2>Soumissions</Heading2>

        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <ListItem />
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <ListItem />
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>
              <ListItem />
            </TimelineContent>
          </TimelineItem>
        </Timeline>

        <List
          ItemComponent={ListItem}
          currentPage={0}
          totalItems={3}
          itemsPerPage={10}
          items={[{ key: '1' }, { key: '2' }, { key: '3' }]}
        ></List>

        <ul className={`my-5 ${fr.cx('fr-accordions-group')}`}>
          <li>
            <Accordion defaultExpanded label="Garanties financières soumis le 24/02/2023">
              <StatutBadge statut="à traiter" />
              <ul className="my-5 gap-2">
                <li>Type : Consignation</li>
                <li>Date d'échéance : 31/01/2025</li>
                <li>Date de constitution : 14/13/2023</li>
                <li>
                  Attestation :
                  <Download
                    details="pdf"
                    label="Télécharger l'attestation"
                    linkProps={{ href: '#' }}
                  />
                </li>
              </ul>
              <div className="flex flex-row gap-4">
                <Link href="#">
                  <i className={`${fr.cx('ri-pencil-line', 'fr-icon--lg')} mr-1`} aria-hidden />
                  Modifier
                </Link>
                <Link href="#">Voir</Link>
              </div>
            </Accordion>
          </li>
          <li>
            <Accordion label="Garanties financières soumis le 24/01/2023">
              <StatutBadge statut="rejeté" />
              <ul className="my-5 gap-2">
                <li>Type : Consignation</li>
                <li>Date d'échéance : 31/01/2025</li>
                <li>Date de constitution : 14/13/2023</li>
                <li>
                  Attestation :
                  <Download
                    details="pdf"
                    label="Télécharger l'attestation"
                    linkProps={{ href: '#' }}
                  />
                </li>
              </ul>
            </Accordion>
          </li>
          <li>
            <Accordion label="Garanties financières soumis le 12/12/2022">
              <StatutBadge statut="validé" />
              <ul className="my-5 gap-2">
                <li>Type : Consignation</li>
                <li>Date d'échéance : 31/01/2025</li>
                <li>Date de constitution : 14/13/2023</li>
                <li>
                  Attestation :
                  <Download
                    details="pdf"
                    label="Télécharger l'attestation"
                    linkProps={{ href: '#' }}
                  />
                </li>
              </ul>
            </Accordion>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
};

const ListItem = () => (
  <>
    <div className="flex flex-col gap-1">
      <h2 className="leading-4">
        Garanties financières soumis le <span className="font-bold">24/01/2023</span>
      </h2>

      <div className="flex flex-col md:flex-row gap-2 mt-3">
        <StatutBadge statut="à-traiter" small />
      </div>

      <ul className=" mt-4 gap-2">
        <li>Type : Consignation</li>
        <li>Date d'échéance : 31/01/2025</li>
        <li>Date de constitution : 14/13/2023</li>
        <li>
          Attestation :
          <Download details="pdf" label="Télécharger l'attestation" linkProps={{ href: '#' }} />
        </li>
      </ul>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-2">
      <p className="italic text-sm">dernière mise à jour le 24/01/2023</p>
      <a href="#" className="self-end" aria-label={`voir le détail`}>
        voir le détail
      </a>
    </div>
  </>
);

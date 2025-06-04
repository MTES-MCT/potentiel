import React, { FC } from 'react';
import { CalendarIcon, Section, CheckIcon } from '../../../components';
import { afficherDate } from '../../../helpers';
import { ClockIcon, DownloadLink, Link } from '../../../components/UI';
import { Routes } from '@potentiel-applications/routes';

type EtapesProjetProps = DesignationItemProps & AchèvementPrévisionnelItemProps;

export const EtapesProjet: FC<EtapesProjetProps> = ({
  identifiantProjet,
  dateDesignation,
  isLegacy,
  dateAchèvementPrévisionnel,
}) => (
  <Section
    title="Étapes du projet"
    icon={<CalendarIcon />}
    className="flex-auto min-w-0 lg:max-w-[60%]"
  >
    <aside aria-label="Progress">
      <ol className="pl-0 overflow-hidden list-none">
        <DesignationItem
          key="project-step-item-designation"
          dateDesignation={dateDesignation}
          identifiantProjet={identifiantProjet}
          isLegacy={isLegacy}
        />
        <AchèvementPrévisionnelItem
          key="project-step-item-achèvement-prévisionnel"
          dateAchèvementPrévisionnel={dateAchèvementPrévisionnel}
        />
      </ol>
    </aside>
  </Section>
);

type DesignationItemProps = {
  identifiantProjet: string;
  dateDesignation: number;
  isLegacy: boolean;
};
const DesignationItem: FC<DesignationItemProps> = ({
  dateDesignation,
  identifiantProjet,
  isLegacy,
}) => {
  return (
    <TimelineItem isLastItem={false}>
      <PastIcon />
      <ContentArea>
        <ItemDate date={dateDesignation} />
        <ItemTitle title="Notification des résultats" />
        {!isLegacy && (
          <DownloadLink
            fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
            className="m-auto"
          >
            Télécharger attestation
          </DownloadLink>
        )}
      </ContentArea>
    </TimelineItem>
  );
};

type AchèvementPrévisionnelItemProps = {
  dateAchèvementPrévisionnel: number;
};
const AchèvementPrévisionnelItem: FC<AchèvementPrévisionnelItemProps> = ({
  dateAchèvementPrévisionnel,
}) => {
  return (
    <TimelineItem isLastItem={false}>
      <NextUpIcon />
      <ContentArea>
        {dateAchèvementPrévisionnel && <ItemDate date={dateAchèvementPrévisionnel} />}
        <ItemTitle title="Date d'achèvement prévisionnelle" />
      </ContentArea>
    </TimelineItem>
  );
};

type TimelineItemProps = {
  children?: React.ReactNode;
  isLastItem: boolean;
};

export const TimelineItem = ({ children, isLastItem }: TimelineItemProps) => (
  <li className={classNames(isLastItem ? '' : 'pb-6 print:pb-3', 'relative')}>
    {isLastItem ? null : (
      <div
        className="print:hidden -ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300 "
        aria-hidden="true"
      />
    )}
    <div className="relative flex items-start group">{children}</div>
  </li>
);

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const PastIcon = () => (
  <div className="flex flex-col print:min-w-[90px]" title="étape validée">
    <div className="hidden print:block text-xs mb-2 whitespace-nowrap">étape validée</div>
    <span className="relative z-2 w-8 h-8 flex items-center justify-center bg-green-700 print:bg-transparent print:border-solid print:border-2 print:border-green-700 rounded-full group-hover:bg-green-900">
      <CheckIcon className="w-5 h-5 text-white print:text-green-700" />
    </span>
  </div>
);

const NextUpIcon = () => (
  <div className="flex flex-col print:min-w-[90px]" title="étape à venir">
    <div className="hidden print:block text-xs mb-2 whitespace-nowrap">étape à venir</div>
    <span
      className={
        'relative z-2 w-8 h-8 flex items-center justify-center bg-gray-300 print:bg-none print:border-solid print:border-2 print:border-gray-400 rounded-full'
      }
    >
      <ClockIcon className="h-5 w-5 text-white print:text-gray-400" />
    </span>
  </div>
);

const ContentArea = (props: { children: any }) => (
  <div className="ml-4 min-w-0 flex flex-col">{props.children}</div>
);

const ItemDate = (props: { date: number }) => (
  <span className="text-sm font-semibold tracking-wide uppercase">{afficherDate(props.date)}</span>
);

const ItemTitle = (props: { title: string }) => (
  <span className="text-sm font-semibold tracking-wide uppercase">{props.title}</span>
);

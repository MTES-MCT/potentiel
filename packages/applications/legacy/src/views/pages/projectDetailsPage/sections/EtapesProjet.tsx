import React, { FC } from 'react';
import { CalendarIcon, Section, CheckIcon } from '../../../components';
import { afficherDate } from '../../../helpers';
import { ClockIcon, DownloadLink } from '../../../components/UI';
import { Routes } from '@potentiel-applications/routes';
import { match } from 'ts-pattern';

export type EtapesProjetProps = {
  identifiantProjet: string;
  isLegacy: boolean;
  étapes: Array<{
    type: 'designation' | 'achèvement-prévisionel' | 'mise-en-service' | 'achèvement-réel';
    date: number;
  }>;
};

export const EtapesProjet: FC<EtapesProjetProps> = ({ identifiantProjet, isLegacy, étapes }) => (
  <Section title="Étapes du projet" icon={<CalendarIcon />}>
    <aside aria-label="Progress">
      <ol className="pl-0 overflow-hidden list-none">
        {étapes
          .sort((a, b) => a.date - b.date)
          .map((étape) =>
            match(étape)
              .with({ type: 'designation' }, ({ date }) => (
                <DesignationItem
                  key="project-step-item-designation"
                  dateDesignation={date}
                  identifiantProjet={identifiantProjet}
                  isLegacy={isLegacy}
                />
              ))
              .with({ type: 'achèvement-prévisionel' }, ({ date }) => (
                <AchèvementPrévisionnelleItem
                  key="project-step-item-achèvement-prévisionnel"
                  dateAchèvementPrévisionnelle={date}
                />
              ))
              .with({ type: 'mise-en-service' }, ({ date }) => (
                <MiseEnServiceItem
                  key="project-step-item-mise-en-service"
                  dateMiseEnService={date}
                />
              ))
              .with({ type: 'achèvement-réel' }, ({ date }) => (
                <AchèvementRéelleItem
                  key="project-step-item-mise-en-service"
                  dateAchèvementRéelle={date}
                />
              ))
              .exhaustive(),
          )}

        {!étapes.find((étape) => étape.type === 'mise-en-service') && (
          <MiseEnServiceItem key="project-step-item-mise-en-service" />
        )}

        {!étapes.find((étape) => étape.type === 'achèvement-réel') && (
          <AchèvementRéelleItem key="project-step-item-mise-en-service" />
        )}
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

type AchèvementPrévisionnelleItemProps = {
  dateAchèvementPrévisionnelle: number;
};
const AchèvementPrévisionnelleItem: FC<AchèvementPrévisionnelleItemProps> = ({
  dateAchèvementPrévisionnelle,
}) => {
  return (
    <TimelineItem isLastItem={false}>
      <NextUpIcon />
      <ContentArea>
        <ItemDate date={dateAchèvementPrévisionnelle} />
        <ItemTitle title="Date d'achèvement prévisionnelle" />
      </ContentArea>
    </TimelineItem>
  );
};

type AchèvementRéelleItemProps = {
  dateAchèvementRéelle?: number;
};
const AchèvementRéelleItem: FC<AchèvementRéelleItemProps> = ({ dateAchèvementRéelle }) => {
  return (
    <TimelineItem isLastItem={false}>
      {dateAchèvementRéelle ? <PastIcon /> : <NextUpIcon />}
      <ContentArea>
        {dateAchèvementRéelle ? <ItemDate date={dateAchèvementRéelle} /> : 'À transmettre'}
        <ItemTitle title="Date d'achèvement réelle" />
      </ContentArea>
    </TimelineItem>
  );
};

type MiseEnServiceItemProps = {
  dateMiseEnService?: number;
};
const MiseEnServiceItem: FC<MiseEnServiceItemProps> = ({ dateMiseEnService }) => {
  return (
    <TimelineItem isLastItem={false}>
      {dateMiseEnService ? <PastIcon /> : <NextUpIcon />}
      <ContentArea>
        {dateMiseEnService ? <ItemDate date={dateMiseEnService} /> : 'À transmettre'}
        <ItemTitle title="Mise en service" />
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

import React, { FC, ReactNode } from 'react';
import { CalendarIcon, Section, CheckIcon } from '../../../components';
import { afficherDate } from '../../../helpers';
import { ClockIcon, DownloadLink, Link } from '../../../components/UI';
import { Routes } from '@potentiel-applications/routes';
import { match } from 'ts-pattern';

export type EtapesProjetProps = {
  identifiantProjet: string;
  doitAfficherAttestationDésignation: boolean;
  étapes: Array<{
    type:
      | 'designation'
      | 'achèvement-prévisionel'
      | 'mise-en-service'
      | 'achèvement-réel'
      | 'abandon'
      | 'recours';
    date: number;
    dateDemande?: string;
  }>;
};

export const EtapesProjet: FC<EtapesProjetProps> = ({
  identifiantProjet,
  doitAfficherAttestationDésignation,
  étapes,
}) => (
  <Section title="Étapes du projet" icon={<CalendarIcon />} className="flex-auto min-w-0">
    <aside aria-label="Progress">
      <ol className="pl-0 overflow-hidden list-none">
        {étapes
          .sort((a, b) => a.date - b.date)
          .map((étape, index) => {
            const isLastItem = index === étapes.length - 1;

            return match(étape)
              .with({ type: 'designation' }, ({ type, date }) => (
                <ÉtapeTerminée key={`project-step-${type}`} titre="Notification" date={date}>
                  {doitAfficherAttestationDésignation && (
                    <DownloadLink
                      fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
                    >
                      Télécharger attestation
                    </DownloadLink>
                  )}
                </ÉtapeTerminée>
              ))
              .with({ type: 'recours' }, ({ type, date }) => (
                <ÉtapeTerminée key={`project-step-${type}`} titre="Recours accordé" date={date}>
                  <Link href={Routes.Recours.détailPourRedirection(identifiantProjet)}>
                    Voir les détails du recours
                  </Link>
                </ÉtapeTerminée>
              ))
              .with({ type: 'abandon' }, ({ type, date, dateDemande }) => (
                <ÉtapeTerminée
                  isLastItem={isLastItem}
                  key={`project-step-${type}`}
                  titre="Abandon accordé"
                  date={date}
                >
                  <Link href={Routes.Abandon.détail(identifiantProjet, dateDemande!)}>
                    Voir les détails de l'abandon
                  </Link>
                </ÉtapeTerminée>
              ))
              .with({ type: 'achèvement-prévisionel' }, ({ type, date }) => (
                <ÉtapeTerminée
                  key={`project-step-${type}`}
                  titre="date d'achèvement prévisionnel"
                  date={date}
                />
              ))
              .with({ type: 'mise-en-service' }, ({ type, date }) => (
                <ÉtapeTerminée key={`project-step-${type}`} titre="Mise en service" date={date} />
              ))
              .with({ type: 'achèvement-réel' }, ({ type, date }) => (
                <ÉtapeTerminée
                  isLastItem={isLastItem}
                  key={`project-step-${type}`}
                  titre="Date d'achèvement réelle"
                  date={date}
                />
              ))
              .exhaustive();
          })}

        {!étapes.find((étape) => étape.type === 'abandon') && (
          <>
            {!étapes.find((étape) => étape.type === 'mise-en-service') && (
              <ÉtapeÀTransmettre
                isLastItem={!!étapes.find((étape) => étape.type === 'achèvement-réel')}
                key={`project-step-mise-en-service`}
                titre="Mise en service"
              />
            )}

            {!étapes.find((étape) => étape.type === 'achèvement-réel') && (
              <ÉtapeÀTransmettre
                isLastItem
                key={`project-step-achèvement-réel`}
                titre="Date d'achèvement réelle"
              />
            )}
          </>
        )}
      </ol>
    </aside>
    <div>
      <Link href={Routes.Historique.afficher(identifiantProjet)}>
        Afficher l'historique complet du projet
      </Link>
    </div>
  </Section>
);

type ÉtapeTerminéeProps = {
  titre: string;
  date: number;
  isLastItem?: boolean;
  children?: ReactNode;
};
const ÉtapeTerminée: FC<ÉtapeTerminéeProps> = ({ titre, date, isLastItem = false, children }) => {
  return (
    <TimelineItem isLastItem={isLastItem}>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={titre} />
        {children}
      </ContentArea>
    </TimelineItem>
  );
};

type ÉtapeÀTransmettreProps = {
  titre: string;
  isLastItem: boolean;
};
const ÉtapeÀTransmettre: FC<ÉtapeÀTransmettreProps> = ({ titre, isLastItem }) => {
  return (
    <TimelineItem isLastItem={isLastItem}>
      <NextUpIcon />
      <ContentArea>
        À transmettre
        <ItemTitle title={titre} />
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

import React, { FC, ReactNode } from 'react';
import { match } from 'ts-pattern';
import clsx from 'clsx';
import Link from 'next/link';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import Warning from '@codegouvfr/react-dsfr/picto/Warning';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormattedDate } from '../../../../../components/atoms/FormattedDate';
import { DownloadDocument } from '../../../../../components/atoms/form/document/DownloadDocument';

import { Section } from './Section';

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
    date: DateTime.RawType;
  }>;
};

export const EtapesProjet: FC<EtapesProjetProps> = ({
  identifiantProjet,
  doitAfficherAttestationDésignation,
  étapes,
}) => (
  <Section title="Étapes du projet" className="flex-auto min-w-0">
    <aside aria-label="Progress">
      <ol className="pl-0 overflow-hidden list-none">
        {étapes
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((étape, index) => {
            const isLastItem = index === étapes.length - 1;

            return match(étape)
              .with({ type: 'designation' }, ({ type, date }) => (
                <ÉtapeTerminée key={`project-step-${type}`} titre="Notification" date={date}>
                  {doitAfficherAttestationDésignation && (
                    <DownloadDocument
                      className="mb-0"
                      label="Télécharger l'attestation"
                      format="pdf"
                      url={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
                    />
                  )}
                </ÉtapeTerminée>
              ))
              .with({ type: 'recours' }, ({ type, date }) => (
                <ÉtapeTerminée key={`project-step-${type}`} titre="Recours accordé" date={date}>
                  <Link href={Routes.Recours.détail(identifiantProjet)}>
                    Voir les détails du recours
                  </Link>
                </ÉtapeTerminée>
              ))
              .with({ type: 'abandon' }, ({ type, date }) => (
                <ÉtapeTerminée
                  isLastItem={isLastItem}
                  key={`project-step-${type}`}
                  titre="Abandon accordé"
                  date={date}
                >
                  <Link href={Routes.Abandon.détail(identifiantProjet)}>
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
                  titre="Date d'achèvement réel"
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
                titre="Date d'achèvement réel"
              />
            )}
          </>
        )}
      </ol>
    </aside>
  </Section>
);

type ÉtapeTerminéeProps = {
  titre: string;
  date: DateTime.RawType;
  isLastItem?: boolean;
  children?: ReactNode;
};

const ÉtapeTerminée: FC<ÉtapeTerminéeProps> = ({ titre, date, isLastItem = false, children }) => {
  return (
    <TimelineItem isLastItem={isLastItem}>
      <Success color="green-emeraude" fontSize="medium" />
      <ContentArea>
        <FormattedDate date={date} />
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
      <Warning fontSize="medium" />
      <ContentArea>
        Données à transmettre
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
  <li className={clsx(isLastItem ? '' : 'pb-6 print:pb-3', 'relative')}>
    {isLastItem ? null : (
      <div
        className="print:hidden -ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300 "
        aria-hidden="true"
      />
    )}
    <div className="relative flex items-start group">{children}</div>
  </li>
);

const ContentArea = (props: { children: React.ReactNode }) => (
  <div className="ml-4 min-w-0 flex flex-col">{props.children}</div>
);

const ItemTitle = (props: { title: string }) => (
  <span className="text-sm font-semibold tracking-wide uppercase">{props.title}</span>
);

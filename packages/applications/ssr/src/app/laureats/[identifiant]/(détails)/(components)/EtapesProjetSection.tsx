import React, { FC, ReactNode } from 'react';
import { match } from 'ts-pattern';
import clsx from 'clsx';
import Link from 'next/link';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import Information from '@codegouvfr/react-dsfr/picto/Information';

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
}) => {
  const étapesTriées = étapes.sort((a, b) => a.date.localeCompare(b.date));
  const estAchevé = étapesTriées.some((étape) => étape.type === 'achèvement-réel');

  return (
    <Section title="Étapes du projet" className="flex-auto min-w-0">
      <aside aria-label="Progress">
        <ol className="pl-0 overflow-hidden list-none">
          {étapesTriées.map((étape, index) => {
            const isLastItem = index === étapesTriées.length - 1;
            return (
              <div key={`project-step-${étape.type}`}>
                {match(étape)
                  .with({ type: 'designation' }, () => (
                    <ÉtapeTerminée titre="Notification" date={étape.date}>
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
                  .with({ type: 'recours' }, () => (
                    <ÉtapeTerminée titre="Recours accordé" date={étape.date}>
                      <Link href={Routes.Recours.détail(identifiantProjet)}>
                        Voir les détails du recours
                      </Link>
                    </ÉtapeTerminée>
                  ))
                  .with({ type: 'abandon' }, () => (
                    <ÉtapeTerminée
                      titre="Abandon accordé"
                      date={étape.date}
                      isLastItem={isLastItem}
                    >
                      <Link href={Routes.Abandon.détail(identifiantProjet)}>
                        Voir les détails de l'abandon
                      </Link>
                    </ÉtapeTerminée>
                  ))
                  .with({ type: 'achèvement-prévisionel' }, () => (
                    <ÉtapeTerminée titre="Date d'achèvement prévisionnel" date={étape.date} />
                  ))
                  .with({ type: 'mise-en-service' }, () => (
                    <ÉtapeTerminée titre="Mise en service" date={étape.date} />
                  ))
                  .with({ type: 'achèvement-réel' }, () => (
                    <ÉtapeTerminée
                      titre="Date d'achèvement réel"
                      date={étape.date}
                      isLastItem={isLastItem}
                    />
                  ))
                  .exhaustive()}
              </div>
            );
          })}
          {!étapesTriées.some((étape) => étape.type === 'abandon') && (
            <>
              {!étapesTriées.some((étape) => étape.type === 'mise-en-service') && (
                <ÉtapeÀTransmettre titre="Mise en service" isLastItem={estAchevé} />
              )}
              {!estAchevé && <ÉtapeÀTransmettre titre="Date d'achèvement réel" isLastItem />}
            </>
          )}
        </ol>
      </aside>
    </Section>
  );
};

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
      <Information color="blue-ecume" fontSize="medium" />
      <ContentArea>
        <span>Donnée à transmettre</span>
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

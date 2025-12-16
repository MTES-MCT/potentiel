import React, { FC, ReactNode } from 'react';
import { match } from 'ts-pattern';
import clsx from 'clsx';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import Information from '@codegouvfr/react-dsfr/picto/Information';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

export type ÉtapeProjet =
  | {
      type: 'designation' | 'achèvement-prévisionel' | 'recours';
      date: DateTime.RawType;
    }
  | { type: 'abandon'; date: DateTime.RawType; dateDemande: DateTime.RawType }
  | {
      type: 'mise-en-service' | 'achèvement-réel';
      date?: DateTime.RawType;
    };
export type EtapesProjetProps = {
  identifiantProjet: string;
  doitAfficherAttestationDésignation: boolean;
  étapes: Array<ÉtapeProjet>;
};

export const EtapesProjet: FC<EtapesProjetProps> = ({
  identifiantProjet,
  doitAfficherAttestationDésignation,
  étapes,
}) => {
  return (
    <>
      <aside aria-label="Progress">
        <ol className="pl-0 overflow-hidden list-none">
          {étapes.map((étape, index) => {
            const isLastItem = index === étapes.length - 1;
            return (
              <div key={`project-step-${étape.type}`}>
                {match(étape)
                  .with({ type: 'designation' }, ({ date }) => (
                    <ÉtapeProjet titre="Notification" date={date}>
                      {doitAfficherAttestationDésignation && (
                        <DownloadDocument
                          className="mb-0"
                          label="Télécharger l'attestation"
                          format="pdf"
                          url={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
                        />
                      )}
                    </ÉtapeProjet>
                  ))
                  .with({ type: 'recours' }, ({ date }) => (
                    <ÉtapeProjet titre="Recours accordé" date={date}>
                      <TertiaryLink href={Routes.Recours.détail(identifiantProjet)}>
                        Voir les détails du recours
                      </TertiaryLink>
                    </ÉtapeProjet>
                  ))
                  .with({ type: 'abandon' }, ({ date, dateDemande }) => (
                    <ÉtapeProjet titre="Abandon accordé" date={date} isLastItem={isLastItem}>
                      <TertiaryLink href={Routes.Abandon.détail(identifiantProjet, dateDemande)}>
                        Voir les détails de l'abandon
                      </TertiaryLink>
                    </ÉtapeProjet>
                  ))
                  .with({ type: 'achèvement-prévisionel' }, ({ date }) => (
                    <ÉtapeProjet titre="Date d'achèvement prévisionnel" date={date} />
                  ))
                  .with({ type: 'mise-en-service' }, ({ date }) => (
                    <ÉtapeProjet titre="Mise en service" date={date} isLastItem={isLastItem} />
                  ))
                  .with({ type: 'achèvement-réel' }, ({ date }) => (
                    <ÉtapeProjet
                      titre="Date d'achèvement réel"
                      date={date}
                      isLastItem={isLastItem}
                    />
                  ))
                  .exhaustive()}
              </div>
            );
          })}
        </ol>
      </aside>
    </>
  );
};

type ÉtapeProjetProps = {
  titre: string;
  date: DateTime.RawType | undefined;
  isLastItem?: boolean;
  children?: ReactNode;
};

const ÉtapeProjet: FC<ÉtapeProjetProps> = ({ titre, date, isLastItem = false, children }) => {
  return (
    <TimelineItem isLastItem={isLastItem}>
      {date ? (
        <Success color="green-emeraude" fontSize="medium" />
      ) : (
        <Information color="red-marianne" fontSize="medium" />
      )}
      <ContentArea>
        {date ? (
          <FormattedDate date={date} />
        ) : (
          <span className="italic">Donnée à transmettre</span>
        )}
        <ItemTitle title={titre} />
        {children}
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

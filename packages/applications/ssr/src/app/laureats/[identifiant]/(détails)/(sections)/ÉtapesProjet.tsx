import Information from '@codegouvfr/react-dsfr/picto/Information';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import React, { FC, ReactNode } from 'react';
import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type ÉtapeProjet =
  | {
      type: 'designation' | 'achèvement-prévisionel';
      date: DateTime.RawType;
    }
  | { type: 'abandon' | 'recours'; date: DateTime.RawType; dateDemande: DateTime.RawType }
  | {
      type: 'mise-en-service' | 'achèvement-réel';
      date?: DateTime.RawType;
    };
export type EtapesProjetProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  doitAfficherAttestationDésignation: boolean;
  étapes: Array<ÉtapeProjet>;
};

export const EtapesProjet: FC<EtapesProjetProps> = ({
  identifiantProjet,
  doitAfficherAttestationDésignation,
  étapes,
}) => {
  return (
    <aside aria-label="Progress">
      <ul className="pl-0 overflow-hidden list-none print:flex print:justify-evenly print:flex-row">
        {étapes.map((étape) =>
          match(étape)
            .with({ type: 'designation' }, ({ date }) => (
              <ÉtapeProjet key={étape.type} titre="Notification" date={date}>
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
            .with({ type: 'recours' }, ({ date, dateDemande }) => (
              <ÉtapeProjet key={étape.type} titre="Recours accordé" date={date}>
                <TertiaryLink href={Routes.Recours.détail(identifiantProjet, dateDemande)}>
                  Voir les détails du recours
                </TertiaryLink>
              </ÉtapeProjet>
            ))
            .with({ type: 'abandon' }, ({ date, dateDemande }) => (
              <ÉtapeProjet key={étape.type} titre="Abandon accordé" date={date}>
                <TertiaryLink href={Routes.Abandon.détail(identifiantProjet, dateDemande)}>
                  Voir les détails de l'abandon
                </TertiaryLink>
              </ÉtapeProjet>
            ))
            .with({ type: 'achèvement-prévisionel' }, ({ date }) => (
              <ÉtapeProjet key={étape.type} titre="Achèvement prévisionnel" date={date} />
            ))
            .with({ type: 'mise-en-service' }, ({ date }) => (
              <ÉtapeProjet key={étape.type} titre="Mise en service" date={date} />
            ))
            .with({ type: 'achèvement-réel' }, ({ date }) => (
              <ÉtapeProjet key={étape.type} titre="Achèvement réel" date={date} />
            ))
            .exhaustive(),
        )}
      </ul>
    </aside>
  );
};

type ÉtapeProjetProps = {
  titre: string;
  date: DateTime.RawType | undefined;
  children?: ReactNode;
};

const ÉtapeProjet: FC<ÉtapeProjetProps> = ({ titre, date, children }) => {
  return (
    <TimelineItem>
      {date ? (
        <Success color="green-emeraude" fontSize="medium" />
      ) : (
        <Information color="red-marianne" fontSize="medium" />
      )}
      <ContentArea>
        {date ? <FormattedDate date={date} /> : <span className="italic">À transmettre</span>}
        <ItemTitle title={titre} />
        {children}
      </ContentArea>
    </TimelineItem>
  );
};

type TimelineItemProps = {
  children?: React.ReactNode;
};

export const TimelineItem = ({ children }: TimelineItemProps) => (
  <li className="pb-6 print:pb-3 last:pb-0 relative print:flex-1">
    <div
      className="print:hidden -ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300 "
      aria-hidden="true"
    />
    <div className="relative flex items-start group">{children}</div>
  </li>
);

const ContentArea = (props: { children: React.ReactNode }) => (
  <div className="ml-4 min-w-0 flex flex-col">{props.children}</div>
);

const ItemTitle = (props: { title: string }) => (
  <span className="text-sm font-semibold tracking-wide uppercase">{props.title}</span>
);

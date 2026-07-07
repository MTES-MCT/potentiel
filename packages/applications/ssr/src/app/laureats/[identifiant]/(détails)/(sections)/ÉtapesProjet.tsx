import Information from '@codegouvfr/react-dsfr/picto/Information';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import type React from 'react';
import type { FC } from 'react';
import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

export type ÉtapeProjet = (
  | {
      type: 'designation' | 'achèvement-prévisionel';
      date: DateTime.RawType;
    }
  | { type: 'abandon' | 'recours'; date: DateTime.RawType; dateDemande: DateTime.RawType }
  | {
      type: 'mise-en-service' | 'achèvement-réel';
      date?: DateTime.RawType;
    }
) & { hasNoDocument?: true };

export type EtapesProjetProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  étapes: Array<ÉtapeProjet>;
};

export const EtapesProjet: FC<EtapesProjetProps> = ({ identifiantProjet, étapes }) => {
  return (
    <aside aria-label="Progress">
      <ul className="pl-0 overflow-hidden list-none print:flex print:justify-evenly print:flex-row">
        {étapes.map((étape) =>
          match(étape)
            .with({ type: 'designation' }, ({ date }) => (
              <ÉtapeProjet
                key={étape.type}
                titre="Notification"
                date={date}
                document={
                  étape.hasNoDocument
                    ? undefined
                    : { url: Routes.Candidature.téléchargerAttestation(identifiantProjet) }
                }
              />
            ))
            .with({ type: 'recours' }, ({ date, dateDemande }) => (
              <ÉtapeProjet
                key={étape.type}
                titre="Recours accordé"
                date={date}
                action={{
                  href: Routes.Recours.détail(identifiantProjet, dateDemande),
                  label: 'Voir les détails du recours',
                }}
              />
            ))
            .with({ type: 'abandon' }, ({ date, dateDemande }) => (
              <ÉtapeProjet
                key={étape.type}
                titre="Abandon accordé"
                date={date}
                action={{
                  href: Routes.Abandon.détail(identifiantProjet, dateDemande),
                  label: "Voir les détails de l'abandon",
                }}
              />
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
  document?: {
    url: string;
  };
  action?: {
    href: string;
    label: string;
  };
};

const ÉtapeProjet: FC<ÉtapeProjetProps> = ({ titre, date, document, action }) => {
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
        {document && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger l'attestation"
            format="pdf"
            url={document.url}
            small
          />
        )}
        {action && <TertiaryLink href={action.href}>{action.label}</TertiaryLink>}
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

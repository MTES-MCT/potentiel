import Information from '@codegouvfr/react-dsfr/picto/Information';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import type { FC } from 'react';

import type { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

// voir pour affiner ce type
type TypeDossier = 'dcr' | 'ptf' | 'cr' | 'crd' | 'mise-en-service';

export type DossierEtape = {
  type: TypeDossier;
  date?: DateTime.RawType;
  document?: {
    url: string;
  };
  action?: {
    href: string;
    label: string;
  };
};

export type DossierProps = {
  dossierEtapes: Array<DossierEtape>;
};

export const Dossier: FC<DossierProps> = ({ dossierEtapes }) => {
  return (
    <section className="w-fit h-fit flex flex-col items-center gap-2 p-3 border-solid border border-dsfr-border-default-grey-default rounded-[3px]">
      <ul className="pl-0 overflow-hidden list-none print:flex print:justify-evenly print:flex-row">
        {dossierEtapes.map((étape) => (
          <DossierEtape
            key={étape.type}
            type={étape.type}
            date={étape.date}
            document={étape.document}
            action={étape.action}
          />
        ))}
      </ul>
    </section>
  );
};

const DossierEtape: FC<DossierEtape> = ({ type, date, document, action }) => {
  return (
    <TimelineItem>
      {date ? (
        <Success color="green-emeraude" fontSize="medium" />
      ) : (
        <Information color="red-marianne" fontSize="medium" />
      )}
      <ContentArea>
        {date ? <FormattedDate date={date} /> : <span className="italic">À transmettre</span>}
        <ItemTitle title={mapTypeToTitre[type]} />
        {document && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger le document"
            format="pdf"
            url={document.url}
            small
          />
        )}
        {action && (
          <TertiaryLink key={action.label} href={action.href}>
            {action.label}
          </TertiaryLink>
        )}
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

const mapTypeToTitre: Record<TypeDossier, string> = {
  dcr: 'demande complète de raccordement',
  ptf: 'proposition technique et financière',
  cr: 'convention de raccordement',
  crd: 'convention directe de raccordement',
  'mise-en-service': 'mise en service',
};

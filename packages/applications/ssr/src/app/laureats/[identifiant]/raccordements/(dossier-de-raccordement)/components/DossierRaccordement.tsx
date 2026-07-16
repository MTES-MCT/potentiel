import Information from '@codegouvfr/react-dsfr/picto/Information';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { Heading3 } from '@/components/atoms/headings';
import { SupprimerDossierDuRaccordement } from '../(supprimer)/SupprimerDossierDuRaccordement';
import { SupprimerDocumentForm } from '../[reference]/document/[type]/supprimer/SupprimerDocument.form';
import { FormatFichierInvalide } from './FormatFichierInvalide';

type TypeDossier =
  | Lauréat.Raccordement.TypeDocumentsRaccordement.RawType
  | 'dcr'
  | 'mise-en-service'
  | 'document';

export type DossierEtapeAction = {
  href: string;
  label: string;
  typeDocument?: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
};

export type DossierEtape = {
  type: TypeDossier;
  data?: {
    date: DateTime.RawType;
    document?: string;
  };
  fallbackText?: string;
  actions: Array<DossierEtapeAction>;
};

type EnrichedDossierEtape = DossierEtape & { référence: string; identifiantProjet: string };

export type DossierProps = {
  dossierEtapes: Array<DossierEtape>;
  peutSupprimerDossier: boolean;
  référence: string;
  identifiantProjet: string;
};

export const DossierRaccordement: FC<DossierProps> = ({
  dossierEtapes,
  référence,
  peutSupprimerDossier,
  identifiantProjet,
}) => {
  return (
    <section className="md:w-1/3 flex flex-col items-start gap-2 p-3 border-solid border border-dsfr-border-default-grey-default rounded-[3px] relative">
      <Heading3>Dossier {référence}</Heading3>
      <ul className="pl-0 overflow-hidden list-none print:flex print:justify-evenly print:flex-row">
        {dossierEtapes.map((étape) => (
          <DossierEtape
            key={étape.type}
            type={étape.type}
            data={étape.data}
            fallbackText={étape.fallbackText}
            actions={étape.actions}
            identifiantProjet={identifiantProjet}
            référence={référence}
          />
        ))}
      </ul>
      {peutSupprimerDossier && (
        <div className="mt-auto">
          <SupprimerDossierDuRaccordement
            identifiantProjet={identifiantProjet}
            référenceDossier={référence}
          />
        </div>
      )}
    </section>
  );
};

const DossierEtape: FC<EnrichedDossierEtape> = ({
  type,
  data,
  fallbackText,
  actions,
  référence,
  identifiantProjet,
}) => {
  return (
    <TimelineItem>
      {data ? (
        <Success color="green-emeraude" fontSize="medium" />
      ) : (
        <Information color="red-marianne" fontSize="medium" />
      )}
      <ContentArea>
        {data ? (
          <FormattedDate date={data.date} />
        ) : (
          <span className="italic text-dsfr-background-flat-pinkMacaron-default">
            {fallbackText}
          </span>
        )}
        <ItemTitle title={mapTypeToTitre[type]} />
        {data?.document && (
          <>
            {data.document.endsWith('.bin') && <FormatFichierInvalide />}
            <DownloadDocument
              className="mb-0"
              label="Télécharger le document"
              format="pdf"
              url={Routes.Document.télécharger(data.document)}
              small
            />
          </>
        )}
        {actions.map((action) =>
          action?.typeDocument ? (
            <SupprimerDocumentForm
              key={action.label}
              identifiantProjet={identifiantProjet}
              référence={référence}
              type={type}
            />
          ) : (
            <div key={action.href}>
              <TertiaryLink key={action.label} href={action.href}>
                {action.label}
              </TertiaryLink>
            </div>
          ),
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
  'proposition-technique-et-financière': 'proposition technique et financière',
  'convention-de-raccordement': 'convention de raccordement',
  'convention-directe-de-raccordement': 'convention directe de raccordement',
  'mise-en-service': 'mise en service',
  document: 'document (PTF, CR, ou CRD)',
};

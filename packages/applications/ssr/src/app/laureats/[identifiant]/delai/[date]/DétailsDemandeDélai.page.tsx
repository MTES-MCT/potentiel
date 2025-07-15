import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { StatutDemandeDélaiBadge } from './StatutDemandeDélaiBadge';
import { AnnulerDemandeDélai } from './annuler/AnnulerDemandeDélai';
import { PasserEnInstructionDemandeDélai } from './passer-en-instruction/PasserEnInstructionDemandeDélai';
import { RejeterDemandeDélai } from './rejeter/RejeterDemandeDélai';

export type DemandeDélaiActions =
  | 'annuler'
  | 'passer-en-instruction'
  | 'reprendre-instruction'
  | 'accorder'
  | 'rejeter';

export type DétailsDemandeDélaiPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>;
  actions: Array<DemandeDélaiActions>;
  historique: Array<TimelineItemProps>;
};

export const DétailsDemandeDélaiPage: FC<DétailsDemandeDélaiPageProps> = ({
  identifiantProjet,
  demande: {
    demandéLe,
    demandéPar,
    nombreDeMois,
    raison,
    statut: { statut },
    pièceJustificative,
  },
  actions,
  historique,
}) => {
  const identifiantProjetValueType = IdentifiantProjet.bind(identifiantProjet);
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjetValueType.formatter()} />}
      leftColumn={{
        children: (
          <>
            <Heading2>Demande de délai</Heading2>
            <div className="flex flex-col gap-4">
              <div className="text-xs italic">
                Demandé le{' '}
                <FormattedDate
                  className="font-semibold"
                  date={DateTime.bind(demandéLe).formatter()}
                />{' '}
                par <span className="font-semibold">{Email.bind(demandéPar).formatter()}</span>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold">Statut :</div>{' '}
                <StatutDemandeDélaiBadge statut={statut} />
              </div>
              <div className="flex gap-2">
                <div className="font-semibold whitespace-nowrap">Nombre de mois :</div>
                <div>{nombreDeMois}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
                <div>{raison}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold whitespace-nowrap">Pièce justificative :</div>
                <DownloadDocument
                  className="mb-0"
                  label="Télécharger la pièce justificative"
                  format={pièceJustificative.format}
                  url={Routes.Document.télécharger(
                    DocumentProjet.bind(pièceJustificative).formatter(),
                  )}
                />
              </div>
            </div>

            <div className="mb-4">
              <Heading2>Historique</Heading2>
              <Timeline items={historique} />
            </div>
          </>
        ),
      }}
      rightColumn={{
        className: 'flex flex-col gap-8',
        children: mapToActionComponents({
          actions,
          identifiantProjet: identifiantProjetValueType,
          dateDemande: DateTime.bind(demandéLe).formatter(),
        }),
      }}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: Array<DemandeDélaiActions>;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDemande: DateTime.RawType;
};

const mapToActionComponents = ({
  identifiantProjet,
  dateDemande,
  actions,
}: MapToActionsComponentsProps) =>
  actions.length > 0 ? (
    <>
      <Heading2>Actions</Heading2>
      {actions.includes('annuler') && (
        <AnnulerDemandeDélai identifiantProjet={identifiantProjet.formatter()} />
      )}
      {(actions.includes('passer-en-instruction') || actions.includes('reprendre-instruction')) && (
        <PasserEnInstructionDemandeDélai
          identifiantProjet={identifiantProjet.formatter()}
          estUneReprise={actions.includes('reprendre-instruction')}
        />
      )}
      {actions.includes('rejeter') && (
        <RejeterDemandeDélai
          identifiantProjet={identifiantProjet.formatter()}
          dateDemande={dateDemande}
        />
      )}
    </>
  ) : null;

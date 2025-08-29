import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime, Email } from '@potentiel-domain/common';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';
import { ReadMore } from '@/components/atoms/ReadMore';

import { StatutDemandeDélaiBadge } from './StatutDemandeDélaiBadge';
import { AnnulerDemandeDélai } from './annuler/AnnulerDemandeDélai';
import { PasserEnInstructionDemandeDélai } from './passer-en-instruction/PasserEnInstructionDemandeDélai';
import { RejeterDemandeDélai } from './rejeter/RejeterDemandeDélai';
import { AccorderDemandeDélai } from './accorder/AccorderDemandeDélai';

export type DemandeDélaiActions =
  | 'annuler'
  | 'passer-en-instruction'
  | 'reprendre-instruction'
  | 'accorder'
  | 'rejeter'
  | 'corriger';

export type DétailsDemandeDélaiPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>;
  dateAchèvementPrévisionnelActuelle: PlainType<
    Lauréat.Achèvement.ConsulterAchèvementReadModel['dateAchèvementPrévisionnel']
  >;
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
    accord,
  },
  dateAchèvementPrévisionnelActuelle,
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
            <div className="flex flex-col gap-8">
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
                  <div className="font-semibold whitespace-nowrap">Nombre de mois demandé(s) :</div>
                  <div>{nombreDeMois} mois</div>
                </div>
                {accord && (
                  <div className="flex gap-2">
                    <div className="font-semibold whitespace-nowrap">
                      Nombre de mois accordé(s) :
                    </div>
                    <div>
                      {accord.nombreDeMois} mois pour une date d'achèvement prévisionnel au{' '}
                      <FormattedDate
                        date={DateTime.bind(accord.dateAchèvementPrévisionnelCalculée).formatter()}
                      />
                    </div>{' '}
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
                  <ReadMore text={raison} />
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
            </div>
          </>
        ),
      }}
      rightColumn={{
        className: 'flex flex-col gap-8',
        children: mapToActionComponents({
          actions,
          identifiantProjet: identifiantProjetValueType,
          dateDemande: DateTime.bind(demandéLe),
          nombreDeMois,
          dateAchèvementPrévisionnelActuelle: Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
            dateAchèvementPrévisionnelActuelle,
          ),
        }),
      }}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: Array<DemandeDélaiActions>;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDemande: DateTime.ValueType;
  nombreDeMois: number;
  dateAchèvementPrévisionnelActuelle: Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType;
};

const mapToActionComponents = ({
  identifiantProjet,
  dateDemande,
  actions,
  nombreDeMois,
  dateAchèvementPrévisionnelActuelle,
}: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {(actions.includes('passer-en-instruction') || actions.includes('reprendre-instruction')) && (
      <PasserEnInstructionDemandeDélai
        identifiantProjet={identifiantProjet.formatter()}
        dateDemande={dateDemande.formatter()}
        estUneReprise={actions.includes('reprendre-instruction')}
      />
    )}
    {actions.includes('accorder') && (
      <AccorderDemandeDélai
        identifiantProjet={identifiantProjet.formatter()}
        dateDemande={dateDemande.formatter()}
        nombreDeMois={nombreDeMois}
        dateAchèvementPrévisionnelActuelle={mapToPlainObject(dateAchèvementPrévisionnelActuelle)}
      />
    )}
    {actions.includes('rejeter') && (
      <RejeterDemandeDélai
        identifiantProjet={identifiantProjet.formatter()}
        dateDemande={dateDemande.formatter()}
      />
    )}

    {actions.includes('corriger') && (
      <Button
        linkProps={{
          href: Routes.Délai.corriger(identifiantProjet.formatter(), dateDemande.formatter()),
          prefetch: false,
        }}
        className="block w-1/2 text-center"
      >
        Corriger
      </Button>
    )}
    {actions.includes('annuler') && (
      <AnnulerDemandeDélai identifiantProjet={identifiantProjet.formatter()} />
    )}
  </ActionsList>
);

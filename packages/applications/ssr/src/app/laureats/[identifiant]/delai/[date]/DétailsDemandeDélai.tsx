import { FC } from 'react';
import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';
import { ReadMore } from '@/components/atoms/ReadMore';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { DétailsDemandeDélaiPageProps } from './DétailsDemandeDélai.page';

export type DétailsDemandeDélaiProps = Pick<DétailsDemandeDélaiPageProps, 'demande'>;

export const DétailsDemandeDélai: FC<DétailsDemandeDélaiProps> = ({ demande }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-4">
      <Heading2>Demande de délai</Heading2>
      <StatutDemandeBadge statut={demande.statut.statut} />
    </div>
    <div className="flex flex-col">
      {demande.accord && (
        <DemandeAccordée
          accordéeLe={demande.accord.accordéeLe}
          accordéePar={demande.accord.accordéePar}
          réponseSignée={demande.accord.réponseSignée}
          dateAchèvementPrévisionnelCalculée={demande.accord.dateAchèvementPrévisionnelCalculée}
          nombreDeMois={demande.nombreDeMois}
        />
      )}
      {demande.rejet && (
        <DemandeRejetée
          rejetéeLe={demande.rejet.rejetéeLe}
          rejetéePar={demande.rejet.rejetéePar}
          réponseSignée={demande.rejet.réponseSignée}
        />
      )}
      {Lauréat.Délai.StatutDemandeDélai.convertirEnValueType(
        demande.statut.statut,
      ).estEnCours() && (
        <Demande
          demandéLe={demande.demandéLe}
          demandéPar={demande.demandéPar}
          nombreDeMois={demande.nombreDeMois}
          statut={demande.statut}
        />
      )}
      <DemandeCommune
        raison={demande.raison}
        pièceJustificative={demande.pièceJustificative}
        autoritéCompétente={demande.autoritéCompétente}
      />
    </div>
  </div>
);

type DemandeCommuneProps = Pick<
  PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>,
  'raison' | 'pièceJustificative' | 'autoritéCompétente'
>;

const DemandeCommune: FC<DemandeCommuneProps> = ({
  autoritéCompétente,
  pièceJustificative,
  raison,
}) => (
  <>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
      <ReadMore text={raison} />
    </div>
    {autoritéCompétente && (
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">
          Autorité compétente pour l'instruction :
        </div>
        <div>
          {match(autoritéCompétente.autoritéCompétente)
            .with('dreal', () => 'DREAL')
            .with('dgec', () => 'DGEC')
            .exhaustive()}
        </div>
      </div>
    )}
    {pièceJustificative && (
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Pièce(s) justificative(s) :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format={pièceJustificative.format}
          url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
        />
      </div>
    )}
  </>
);

type DemandeProps = Pick<
  PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>,
  'demandéLe' | 'demandéPar' | 'nombreDeMois' | 'statut'
>;

const Demande: FC<DemandeProps> = ({ demandéLe, demandéPar, nombreDeMois }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Demandé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéPar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">
        Nombre de mois demandé{nombreDeMois > 1 ? 's' : ''} :
      </div>
      <div>{nombreDeMois} mois</div>
    </div>
  </div>
);

type DemandeAccordéeProps = NonNullable<
  PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>['accord']
>;

const DemandeAccordée: FC<DemandeAccordéeProps> = ({
  dateAchèvementPrévisionnelCalculée,
  nombreDeMois,
  accordéeLe,
  accordéePar,
  réponseSignée,
}) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Accordée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(accordéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(accordéePar).formatter()}</span>
    </div>
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">
          Nombre de mois accordé{nombreDeMois > 1 ? 's' : ''} :
        </div>
        <div>{nombreDeMois} mois</div>
      </div>
      <div className="text-xs italic">
        (Date d'achèvement prévisionnel au{' '}
        <FormattedDate date={DateTime.bind(dateAchèvementPrévisionnelCalculée).formatter()} />)
      </div>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </div>
);

type DemandeRejetéeProps = NonNullable<
  PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>['rejet']
>;

const DemandeRejetée: FC<DemandeRejetéeProps> = ({ rejetéeLe, rejetéePar, réponseSignée }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Rejetée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(rejetéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(rejetéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </div>
);

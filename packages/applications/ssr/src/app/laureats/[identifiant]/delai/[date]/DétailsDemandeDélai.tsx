import type { FC } from 'react';
import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, Email } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { DisplayAuteur } from '@/components/atoms/demande/DisplayAuteur';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2 } from '@/components/atoms/headings';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { getMotifDemandeDélaiLabel } from '../_helpers/getMotifDemandeDélaiLabel';
import type { DétailsDemandeDélaiPageProps } from './DétailsDemandeDélai.page';

export type DétailsDemandeDélaiProps = Pick<DétailsDemandeDélaiPageProps, 'demande'>;

export const DétailsDemandeDélai: FC<DétailsDemandeDélaiProps> = ({ demande }) => (
  <div className="flex flex-col gap-4">
    <Heading2>Détail de la demande</Heading2>
    <div className="flex flex-col gap-2">
      {demande.accord && <DemandeAccordée accord={demande.accord} motif={demande.motif} />}
      {demande.rejet && <DemandeRejetée rejet={demande.rejet} motif={demande.motif} />}
      {Lauréat.Délai.StatutDemandeDélai.convertirEnValueType(
        demande.statut.statut,
      ).estEnCours() && <DemandeEnCours demande={demande} />}
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
  <div className="flex flex-col gap-2">
    <DisplayRaisonChangement raison={raison} className="whitespace-nowrap font-semibold" />
    {autoritéCompétente && (
      <div className="flex flex-wrap gap-2">
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
      <div className="flex flex-wrap gap-2">
        <div className="font-semibold whitespace-nowrap">Pièce(s) justificative(s) :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format={pièceJustificative.format}
          url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
        />
      </div>
    )}
  </div>
);

type DemandeProps = {
  demande: PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>;
};

const DemandeEnCours: FC<DemandeProps> = ({
  demande: { demandéLe, demandéPar, nombreDeMois, motif },
}) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Demandé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} />
      <DisplayAuteur email={Email.bind(demandéPar)} />
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Motif :</div>
      <div>{getMotifDemandeDélaiLabel(motif.motif)}</div>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">
        Nombre de mois demandé{nombreDeMois > 1 ? 's' : ''} :
      </div>
      <div>{nombreDeMois} mois</div>
    </div>
  </div>
);

type DemandeAccordéeProps = {
  motif: PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>['motif'];
  accord: NonNullable<PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>['accord']>;
};

const DemandeAccordée: FC<DemandeAccordéeProps> = ({
  motif,
  accord: {
    dateAchèvementPrévisionnelCalculée,
    nombreDeMois,
    accordéeLe,
    accordéePar,
    réponseSignée,
  },
}) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Accordée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(accordéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(accordéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Motif :</div>
      <div>{getMotifDemandeDélaiLabel(motif.motif)}</div>
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

type DemandeRejetéeProps = {
  motif: PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>['motif'];
  rejet: NonNullable<PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>['rejet']>;
};

const DemandeRejetée: FC<DemandeRejetéeProps> = ({
  motif,
  rejet: { rejetéeLe, rejetéePar, réponseSignée },
}) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Rejetée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(rejetéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(rejetéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Motif :</div>
      <div>{getMotifDemandeDélaiLabel(motif.motif)}</div>
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

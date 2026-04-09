import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type HistoriqueMainlevéeRejetéeProps = {
  mainlevéesRejetées: PlainType<Lauréat.GarantiesFinancières.ListerMainlevéeItemReadModel>[];
};

export const HistoriqueMainlevéeRejetée: FC<HistoriqueMainlevéeRejetéeProps> = ({
  mainlevéesRejetées,
}) => <Timeline items={mainlevéesRejetées.map(mapToItem)} />;

const mapToItem = ({
  rejet,
  demande,
}: PlainType<Lauréat.GarantiesFinancières.ListerMainlevéeItemReadModel>): TimelineItemProps => {
  if (!rejet) {
    return {
      status: 'warning',
      date: DateTime.now().formatter(),
      title: 'Étape inconnue',
      details: 'Détails de la mainlevée non disponibles',
    };
  }
  const courrierRejet = DocumentProjet.bind(rejet.courrierRejet).formatter();
  return {
    status: 'warning',
    date: rejet.rejetéLe.date,
    title: (
      <div>
        Mainlevée rejetée par <span className="font-semibold">{rejet.rejetéPar.email}</span>
      </div>
    ),
    details: (
      <div className="flex flex-col gap-1 justify-center">
        <div>
          Mainlevée demandée le :{' '}
          <FormattedDate className="font-semibold" date={demande.demandéeLe.date} /> par{' '}
          <span className="font-semibold">{demande.demandéePar.email}</span>
        </div>
        <DownloadDocument
          format="pdf"
          label="Télécharger la réponse signée"
          url={Routes.Document.télécharger(courrierRejet)}
        />
      </div>
    ),
  };
};

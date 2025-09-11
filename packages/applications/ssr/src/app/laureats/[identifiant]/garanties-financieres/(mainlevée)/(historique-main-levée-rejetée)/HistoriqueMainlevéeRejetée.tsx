import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { Heading3 } from '@/components/atoms/headings';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Timeline, TimelineItemProps, TimelineProps } from '@/components/organisms/Timeline';
import { FormattedDate } from '@/components//atoms/FormattedDate';
import { CorrigerRéponseSignée } from '@/app/laureats/[identifiant]/garanties-financieres/(mainlevée)/corrigerRéponseSignée/CorrigerRéponseSignée.form';

import { ActionGarantiesFinancières } from '../../DétailsGarantiesFinancières.page';

export type HistoriqueMainlevéeRejetéeProps = {
  mainlevéesRejetées: PlainType<Lauréat.GarantiesFinancières.ListerMainlevéeItemReadModel>[];
  actions: ActionGarantiesFinancières[];
};

export const HistoriqueMainlevéeRejetée: FC<HistoriqueMainlevéeRejetéeProps> = ({
  mainlevéesRejetées,
  actions,
}) => {
  const nombreDeMainlevéesRejetées = mainlevéesRejetées.length;

  const items: TimelineProps['items'] = mainlevéesRejetées.map((mainlevée) =>
    mapToItem(mainlevée, actions),
  );

  return (
    <div className="p-3 flex-1 flex flex-col items-start">
      <Heading3>Historique des mainlevées rejetées</Heading3>
      <div className="text-xs italic">
        {nombreDeMainlevéesRejetées} mainlevée{nombreDeMainlevéesRejetées > 1 && 's'} rejetée
        {nombreDeMainlevéesRejetées > 1 && 's'}
      </div>
      <div className="mt-3">
        <Timeline items={items} />
      </div>
    </div>
  );
};

const mapToItem = (
  {
    rejet,
    demande,
    identifiantProjet,
  }: PlainType<Lauréat.GarantiesFinancières.ListerMainlevéeItemReadModel>,
  actions: ActionGarantiesFinancières[],
): TimelineItemProps => {
  if (!rejet) {
    return {
      status: 'warning',
      date: DateTime.now().formatter(),
      title: 'Étape inconnue',
      content: 'Détails de la mainlevée non disponibles',
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
    content: (
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
        {actions.includes('garantiesFinancières.mainlevée.corrigerRéponseSignée') ? (
          <CorrigerRéponseSignée
            identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
            courrierRéponseÀCorriger={courrierRejet}
          />
        ) : null}
      </div>
    ),
  };
};

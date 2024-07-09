import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';

import { Heading3 } from '../../../../atoms/headings';
import { DownloadDocument } from '../../../../atoms/form/DownloadDocument';
import { Timeline, TimelineProps } from '../../../../organisms/Timeline';
import { CorrigerRéponseSignée } from '../../mainlevée/corrigerRéponseSignée/CorrigerRéponseSignée';

export type HistoriqueMainlevéeRejetéeProps = {
  identifiantProjet: string;
  historiqueMainlevée: {
    historique: Array<{
      motif: string;
      demandéeLe: Iso8601DateTime;
      rejet: { rejetéLe: Iso8601DateTime; rejetéPar: string; courrierRejet: string };
    }>;
    actions: Array<'modifier-courrier-réponse-mainlevée-gf'>;
  };
};

export const HistoriqueMainlevéeRejetée: FC<HistoriqueMainlevéeRejetéeProps> = ({
  historiqueMainlevée,
  identifiantProjet,
}) => {
  const nombreDeMainlevéesRejetées = historiqueMainlevée.historique.length;

  const items: TimelineProps['items'] = historiqueMainlevée.historique.map((mainlevéeRejetée) => ({
    status: 'warning',
    date: mainlevéeRejetée.rejet.rejetéLe,
    title: (
      <div>
        Mainlevée rejetée par{' '}
        {<span className="font-semibold">{mainlevéeRejetée.rejet.rejetéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-1 justify-center">
        <DownloadDocument
          format="pdf"
          label="Télécharger la réponse signée"
          url={Routes.Document.télécharger(mainlevéeRejetée.rejet.courrierRejet)}
        />
        {mainlevéeRejetée.rejet.courrierRejet &&
        historiqueMainlevée.actions.includes('modifier-courrier-réponse-mainlevée-gf') ? (
          <CorrigerRéponseSignée
            identifiantProjet={identifiantProjet}
            courrierRéponse={mainlevéeRejetée.rejet.courrierRejet}
            key={mainlevéeRejetée.rejet.rejetéLe}
          />
        ) : null}
      </div>
    ),
  }));

  return (
    <div className="p-3 flex-1">
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

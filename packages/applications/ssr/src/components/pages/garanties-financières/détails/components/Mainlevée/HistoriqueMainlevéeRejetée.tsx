import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';
import { Email } from '@potentiel-domain/common';

import { Heading3 } from '@/components/atoms/headings';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Timeline, TimelineProps } from '@/components/organisms/Timeline';
import { FormattedDate } from '@/components//atoms/FormattedDate';

import { CorrigerRéponseSignée } from '../../../mainlevée/corrigerRéponseSignée/CorrigerRéponseSignée.form';

export type HistoriqueMainlevéeRejetéeProps = {
  identifiantProjet: string;
  historiqueMainlevée: {
    historique: Array<{
      motif: string;
      demande: {
        date: Iso8601DateTime;
        par: Email.RawType;
      };
      rejet: { date: Iso8601DateTime; par: Email.RawType; courrierRejet: string };
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
    date: mainlevéeRejetée.rejet.date,
    title: (
      <div>
        Mainlevée rejetée par <span className="font-semibold">{mainlevéeRejetée.rejet.par}</span>
      </div>
    ),
    content: (
      <div className="flex flex-col gap-1 justify-center">
        <div>
          Mainlevée demandée le :{' '}
          <FormattedDate className="font-semibold" date={mainlevéeRejetée.demande.date} /> par{' '}
          <span className="font-semibold">{mainlevéeRejetée.demande.par}</span>
        </div>
        <DownloadDocument
          format="pdf"
          label="Télécharger la réponse signée"
          url={Routes.Document.télécharger(mainlevéeRejetée.rejet.courrierRejet)}
        />
        {mainlevéeRejetée.rejet.courrierRejet &&
        historiqueMainlevée.actions.includes('modifier-courrier-réponse-mainlevée-gf') ? (
          <CorrigerRéponseSignée
            identifiantProjet={identifiantProjet}
            courrierRéponseÀCorriger={mainlevéeRejetée.rejet.courrierRejet}
            key={mainlevéeRejetée.rejet.date}
          />
        ) : null}
      </div>
    ),
  }));

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

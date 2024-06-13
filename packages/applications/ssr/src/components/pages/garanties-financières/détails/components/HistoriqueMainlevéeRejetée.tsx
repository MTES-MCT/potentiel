import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';

import { FormattedDate } from '../../../../atoms/FormattedDate';
import { Heading3 } from '../../../../atoms/headings';
import { InputDownload } from '../../../../atoms/form/InputDownload';

export type HistoriqueMainlevéeRejetéeProps = {
  historique: Array<{
    motif: string;
    demandéeLe: Iso8601DateTime;
    rejet: { rejetéLe: Iso8601DateTime; rejetéPar: string; courrierRejet: { format: string } };
  }>;
};

export const HistoriqueMainlevéeRejetée: FC<HistoriqueMainlevéeRejetéeProps> = ({ historique }) => {
  const nombreDeMainlevéesRejetées = historique.length;

  return (
    <div className="mt-5 p-3 border border-dsfr-border-default-blueFrance-default">
      <Heading3>Historique des mainlevées rejetées</Heading3>
      <div className="text-xs italic">
        {nombreDeMainlevéesRejetées} mainlevée{nombreDeMainlevéesRejetées > 1 && 's'} rejetée
        {nombreDeMainlevéesRejetées > 1 && 's'}
      </div>
      <div className="mt-3 flex flex-row flex-wrap gap-2">
        {historique.map((mainlevéeRejetée) => (
          <div
            className="border border-dsfr-border-default-grey-default p-1"
            key={mainlevéeRejetée.demandéeLe}
          >
            <p>
              Mainlevée demandée le :{' '}
              <FormattedDate className="font-semibold" date={mainlevéeRejetée.demandéeLe} />
            </p>
            <div>
              Rejetée le{' '}
              <FormattedDate className="font-semibold" date={mainlevéeRejetée.rejet.rejetéLe} />
            </div>
            <div>
              <InputDownload
                ariaLabel="Télécharger la réponse signée"
                details=""
                label="Télécharger la réponse signée"
                linkProps={{
                  href: Routes.Document.télécharger(mainlevéeRejetée.rejet.courrierRejet.format),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '../../../../atoms/FormattedDate';
import { Heading3 } from '../../../../atoms/headings';

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
    <div className="mt-3 p-3 border border-dsfr-border-actionLow-blueFrance-default">
      <Heading3>Historique des mainlevées rejetées</Heading3>
      <div className="text-xs italic">
        ${nombreDeMainlevéesRejetées} mainlevée{nombreDeMainlevéesRejetées > 1 && 's'} rejetée
        {nombreDeMainlevéesRejetées > 1 && 's'}
      </div>
      {historique.map((mainlevéeRejetée) => (
        <>
          <div>
            Mainlevée demandée le :{' '}
            <FormattedDate className="font-semibold" date={mainlevéeRejetée.demandéeLe} />
          </div>
          ;
          <div>
            Rejetée au motif de : <span className="font-semibold">{mainlevéeRejetée.motif}</span>{' '}
            par <span className="font-semibold">{mainlevéeRejetée.rejet.rejetéLe}</span>
          </div>
          {/* <div>
LIEN telechargement courrier réponse
          </div> */}
          ;
        </>
      ))}
    </div>
  );
};

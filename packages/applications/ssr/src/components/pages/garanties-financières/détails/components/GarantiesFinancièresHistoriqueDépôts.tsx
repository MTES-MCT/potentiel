import { FC } from 'react';

import { Heading2 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { formatDateForText } from '@/utils/formatDateForText';

import { StatutDépôtGarantiesFinancièresBadge } from '../../StatutDépôtGarantiesFinancièresBadge';

export type DépôtStatut = 'en-cours' | 'validé' | 'rejeté';

export type DépôtGarantiesFinancières = {
  type: string;
  dateÉchéance?: string;
  statut: DépôtStatut;
  dateConstitution: string;
  soumisLe: string;
  attestation: string;
  dernièreMiseÀJour: {
    date: string;
    par: string;
  };
};

export type GarantiesFinancièresHistoriqueDépôtsProps = {
  identifiantProjet: string;
  dépôts: Array<DépôtGarantiesFinancières>;
};

export const GarantiesFinancièresHistoriqueDépôts: FC<
  GarantiesFinancièresHistoriqueDépôtsProps
> = ({ dépôts }) => (
  <>
    <Heading2>Historique</Heading2>
    <Timeline
      className="mt-4"
      items={dépôts.map((dépôt) => ({
        date: formatDateForText(dépôt.dernièreMiseÀJour.date),
        status: getTimelineItemStatus(dépôt.statut),
        title: (
          <p>
            Garanties financières <StatutDépôtGarantiesFinancièresBadge statut={dépôt.statut} />
          </p>
        ),
        content: (
          <>
            <div className="flex flex-col gap-8 mt-2 mb-6">
              <ul className="flex-1">
                <li>
                  Type : <span className="font-semibold">{dépôt.type}</span>
                </li>
                <li>
                  Date de dépôt :{' '}
                  <span className="font-semibold">{formatDateForText(dépôt.soumisLe)}</span>
                </li>
                <li>
                  Date de constitution :{' '}
                  <span className="font-semibold">{formatDateForText(dépôt.dateConstitution)}</span>
                </li>
                {dépôt.dateÉchéance && (
                  <li>
                    Date d'échéance :{' '}
                    <span className="font-semibold">{formatDateForText(dépôt.dateÉchéance)}</span>
                  </li>
                )}
              </ul>
            </div>
          </>
        ),
      }))}
    />
  </>
);

const getTimelineItemStatus = (statut: DépôtStatut): TimelineItemProps['status'] => {
  switch (statut) {
    case 'en-cours':
      return 'info';
    case 'validé':
      return 'success';
    case 'rejeté':
      return 'error';
  }
};

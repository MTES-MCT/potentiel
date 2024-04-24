import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { Heading2 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

type DépôtStatut = 'en-cours' | 'validé' | 'rejeté';

export type DépôtGarantiesFinancières = {
  type: string;
  dateÉchéance?: Iso8601DateTime;
  statut: DépôtStatut;
  dateConstitution: Iso8601DateTime;
  soumisLe: Iso8601DateTime;
  attestation: string;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
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
        date: dépôt.dernièreMiseÀJour.date,
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
                  Date de dépôt : <FormattedDate className="font-semibold" date={dépôt.soumisLe} />
                </li>
                <li>
                  Date de constitution :{' '}
                  <span className="font-semibold">
                    {<FormattedDate date={dépôt.dateConstitution} />}
                  </span>
                </li>
                {dépôt.dateÉchéance && (
                  <li>
                    Date d'échéance :{' '}
                    <span className="font-semibold">
                      {<FormattedDate date={dépôt.dateÉchéance} />}
                    </span>
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

type StatutDépôtGarantiesFinancièresBadgProps = {
  statut: DépôtStatut;
};
const StatutDépôtGarantiesFinancièresBadge: FC<StatutDépôtGarantiesFinancièresBadgProps> = ({
  statut,
}) => {
  const getSeverity = (statut: DépôtStatut): BadgeProps['severity'] => {
    switch (statut) {
      case 'en-cours':
        return 'new';
      case 'rejeté':
        return 'error';
      case 'validé':
        return 'success';
    }
  };

  return (
    <Badge noIcon severity={getSeverity(statut)} small={true}>
      {statut.replace(/-/g, ' ')}
    </Badge>
  );
};

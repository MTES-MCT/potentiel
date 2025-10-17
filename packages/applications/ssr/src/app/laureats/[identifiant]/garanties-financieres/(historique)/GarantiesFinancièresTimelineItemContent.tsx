import { FC } from 'react';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

import { getGarantiesFinancièresDateLabel } from '../_helpers/getGarantiesFinancièresDateLabel';

type GarantiesFinancièresTimelineItemContentProps = {
  type: Lauréat.GarantiesFinancières.GarantiesFinancières.RawType['type'];
  dateÉchéance?: DateTime.RawType;
  dateConstitution: DateTime.RawType;
};
export const GarantiesFinancièresTimelineItemContent: FC<
  GarantiesFinancièresTimelineItemContentProps
> = ({ dateConstitution, type, dateÉchéance }) => (
  <div className="flex flex-col gap-2">
    <div>
      Type : <span className="font-semibold">{type}</span>
    </div>
    {dateÉchéance && (
      <div>
        Date d'échéance :{' '}
        <span className="font-semibold">{<FormattedDate date={dateÉchéance} />}</span>
      </div>
    )}
    <div>
      {getGarantiesFinancièresDateLabel(type)} :{' '}
      <span className="font-semibold">{<FormattedDate date={dateConstitution} />}</span>
    </div>
  </div>
);

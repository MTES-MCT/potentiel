import Notice from '@codegouvfr/react-dsfr/Notice';

import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const InfoBoxDateAchèvementPrévisionnel = ({
  dateAchèvementPrévisionnelActuelle,
}: {
  dateAchèvementPrévisionnelActuelle: PlainType<Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType>;
}) => (
  <Notice
    severity="info"
    className="w-fit"
    title={
      <span>
        La date d'achèvement prévisionnel actuelle est le{' '}
        <FormattedDate
          date={dateAchèvementPrévisionnelActuelle.dateTime.date}
          className="font-semibold"
        />
      </span>
    }
  />
);

import type { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const InfoDateAchèvementPrévisionnelAprèsDélaiAccordé = ({
  nouvelleDate,
}: {
  nouvelleDate: DateTime.RawType;
}) => (
  <div>
    Une fois la demande de délai accordée, la date d'achèvement <br className="hidden md:block" />
    prévisionnel sera le <FormattedDate date={nouvelleDate} className="font-semibold" />
  </div>
);

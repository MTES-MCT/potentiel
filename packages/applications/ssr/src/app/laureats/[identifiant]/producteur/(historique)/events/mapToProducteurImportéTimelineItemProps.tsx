import type { Lauréat } from '@potentiel-domain/projet';

import { FormattedSIREN, FormattedSIRET } from '@/components/atoms/FormattedNuméroIdentification';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToProducteurImportéTimelineItemProps = (
  event: Lauréat.Producteur.ProducteurImportéEvent,
): TimelineItemProps => {
  const { importéLe, producteur, numéroIdentification } = event.payload;
  return {
    date: importéLe,
    title: (
      <>
        Candidature
        <div className="flex flex-col gap-2">
          <div>
            Nom du producteur : <span className="font-semibold">{producteur}</span>
          </div>
          <div className="flex flex-col">
            <span>
              Numéro SIRET : <FormattedSIRET value={numéroIdentification?.siret} />
            </span>
            <span>
              Numéro SIREN : <FormattedSIREN value={numéroIdentification?.siren} />
            </span>
          </div>
        </div>
      </>
    ),
  };
};

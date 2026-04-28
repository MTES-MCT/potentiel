import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToProducteurImportéTimelineItemProps = (
  event: Lauréat.Producteur.ProducteurImportéEvent,
): TimelineItemProps => {
  const { importéLe, producteur, numéroImmatriculation } = event.payload;
  return {
    date: importéLe,
    title: (
      <>
        Candidature :
        <div className="flex flex-col gap-2">
          <div>
            producteur : <span className="font-semibold">{producteur}</span>
          </div>
          {numéroImmatriculation && (
            <div className="flex flex-col">
              {numéroImmatriculation.siret && (
                <span>Numéro SIRET : {numéroImmatriculation.siret}</span>
              )}
              {numéroImmatriculation.siren && (
                <span>Numéro SIREN : {numéroImmatriculation.siren}</span>
              )}
            </div>
          )}
        </div>
      </>
    ),
  };
};

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

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
            <span>Numéro SIRET : {numéroIdentification?.siret || 'Non renseigné'}</span>
            <span>Numéro SIREN : {numéroIdentification?.siren || 'Non renseigné'}</span>
          </div>
        </div>
      </>
    ),
  };
};

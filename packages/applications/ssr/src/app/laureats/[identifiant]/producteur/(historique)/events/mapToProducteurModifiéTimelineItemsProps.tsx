import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { formatDateToText } from '@/app/_helpers';

export const mapToProducteurModifiéTimelineItemsProps = (
  event: Lauréat.Producteur.ProducteurModifiéEvent,
): TimelineItemProps => {
  const { modifiéLe, modifiéPar, producteur, pièceJustificative, raison, identifiantProjet } =
    event.payload;

  return {
    date: modifiéLe,
    title: 'Producteur modifié',
    actor: modifiéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Producteur.TypeDocumentProducteur.pièceJustificative.formatter(),
        modifiéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif joint au changement de producteur enregistré le ${formatDateToText(modifiéLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau producteur : <span className="font-semibold">{producteur}</span>
        </div>
        <DisplayRaisonChangement raison={raison} />
      </div>
    ),
  };
};

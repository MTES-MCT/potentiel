import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementProducteurEnregistréTimelineItemProps = (
  event: Lauréat.Producteur.ChangementProducteurEnregistréEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, identifiantProjet, pièceJustificative, producteur, raison } =
    event.payload;
  return {
    date: enregistréLe,
    title: 'Producteur modifié',
    actor: enregistréPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Producteur.TypeDocumentProducteur.pièceJustificative.formatter(),
        enregistréLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif joint au changement de producteur enregistré le ${formatDateToText(enregistréLe)}`,
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

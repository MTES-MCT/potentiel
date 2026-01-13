import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { formatDateToText } from '@/app/_helpers';

export const mapToNomProjetModifiéTimelineItemProps = (
  event: Lauréat.NomProjetModifiéEvent,
): TimelineItemProps => {
  const {
    nomProjet,
    modifiéLe,
    modifiéPar,
    raison,
    identifiantProjet,
    pièceJustificative,
    ancienNomProjet,
  } = event.payload;

  return {
    date: modifiéLe,
    title: 'Nom du projet modifié',
    actor: modifiéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.TypeDocumentNomProjet.pièceJustificative.formatter(),
        modifiéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif du changement de nom enregistré le ${formatDateToText(modifiéLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau nom : <span className="font-semibold">{nomProjet}</span>
        </div>
        <div>
          Ancien nom : <span className="font-semibold">{ancienNomProjet}</span>
        </div>
        <DisplayRaisonChangement raison={raison} />
      </div>
    ),
  };
};

import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementNomProjetEnregistréTimelineItemProps = (
  event: Lauréat.ChangementNomProjetEnregistréEvent,
): TimelineItemProps => {
  const {
    nomProjet,
    enregistréLe,
    enregistréPar,
    raison,
    pièceJustificative,
    identifiantProjet,
    ancienNomProjet,
  } = event.payload;

  return {
    date: enregistréLe,
    title: 'Nom du projet modifié',
    actor: enregistréPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.TypeDocumentNomProjet.pièceJustificative.formatter(),
        enregistréLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif de la modification du nom du projet en date du ${formatDateToText(enregistréLe)}`,
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

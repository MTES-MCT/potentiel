import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { formatDateToText } from '@/app/_helpers';

export const mapToDemandeDélaiCorrigéeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiCorrigéeEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    dateDemande,
    corrigéeLe,
    corrigéePar,
    pièceJustificative,
    nombreDeMois,
    raison,
  } = event.payload;

  return {
    date: corrigéeLe,
    title: 'Demande de délai corrigée',
    actor: corrigéePar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
        dateDemande,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif de la demande de délai corrigée le ${formatDateToText(corrigéeLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Durée : <span className="font-semibold">{nombreDeMois} mois</span>
        </div>
        <DisplayRaisonChangement raison={raison} />
      </div>
    ),
  };
};

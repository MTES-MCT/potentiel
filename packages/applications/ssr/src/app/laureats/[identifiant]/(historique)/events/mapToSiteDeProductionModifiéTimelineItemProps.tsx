import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { formatDateToText } from '@/app/_helpers';

export const mapToSiteDeProductionModifiéTimelineItemProps = (
  event: Lauréat.SiteDeProductionModifiéEvent,
): TimelineItemProps => {
  const { localité, modifiéLe, modifiéPar, raison, pièceJustificative, identifiantProjet } =
    event.payload;

  return {
    date: modifiéLe,
    title: 'Site de production modifié',
    actor: modifiéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.TypeDocumentSiteDeProduction.pièceJustificative.formatter(),
        modifiéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif de la modification de site de production enregistrée le ${formatDateToText(modifiéLe)}`,
    },
    details: (
      <>
        <div className="flex flex-col">
          <span className="font-semibold">Nouveau site de production : </span>
          <span>{localité.adresse1}</span>
          {localité.adresse2 && <span>{localité.adresse2}</span>}
          <span>
            {localité.codePostal} {localité.commune}
          </span>
          <span>
            {localité.département} {localité.région}
          </span>
        </div>
        <DisplayRaisonChangement raison={raison} />
      </>
    ),
  };
};

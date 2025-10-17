import { Lauréat } from '@potentiel-domain/projet';

import { ReadMore } from '@/components/atoms/ReadMore';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToSiteDeProductionModifiéTimelineItemProps = (
  event: Lauréat.SiteDeProductionModifiéEvent,
): TimelineItemProps => {
  const { localité, modifiéLe, modifiéPar, raison } = event.payload;

  return {
    date: modifiéLe,
    title: 'Site de production modifié',
    acteur: modifiéPar,
    content: (
      <>
        {raison && (
          <div>
            Raison : <ReadMore text={raison} className="font-semibold" />
          </div>
        )}
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
      </>
    ),
  };
};

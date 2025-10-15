import { Lauréat } from '@potentiel-domain/projet';

import { ReadMore } from '@/components/atoms/ReadMore';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToSiteDeProductionModifiéTimelineItemProps = (
  modification: Lauréat.SiteDeProductionModifiéEvent,
) => {
  const { localité, modifiéLe, modifiéPar, raison } = modification.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Site de production modifié <TimelineItemUserEmail email={modifiéPar} />
      </div>
    ),
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

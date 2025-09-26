import { Lauréat } from '@potentiel-domain/projet';

export const mapToSiteDeProductionModifiéTimelineItemProps = (
  modification: Lauréat.SiteDeProductionModifiéEvent,
) => {
  const { localité, modifiéLe, modifiéPar } = modification.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Site de production modifié par {<span className="font-semibold">{modifiéPar}</span>}
      </div>
    ),
    content: (
      <div>
        <span>{localité.adresse1}</span>
        {localité.adresse2 && <span>{localité.adresse2}</span>}
        <span>
          {localité.codePostal} {localité.commune}
        </span>
        <span>
          {localité.département} {localité.région}
        </span>
      </div>
    ),
  };
};

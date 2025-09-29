import { Lauréat } from '@potentiel-domain/projet';

export const mapToSiteDeProductionModifiéTimelineItemProps = (
  modification: Lauréat.SiteDeProductionModifiéEvent,
) => {
  const { localité, modifiéLe, modifiéPar, raison } = modification.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Site de production modifié par {<span className="font-semibold">{modifiéPar}</span>}
      </div>
    ),
    content: (
      <>
        {raison && (
          <div>
            <span className="font-semibold">Raison : </span>
            {raison}
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

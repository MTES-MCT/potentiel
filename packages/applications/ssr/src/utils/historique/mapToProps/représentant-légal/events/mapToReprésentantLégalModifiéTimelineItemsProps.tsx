import { Lauréat } from '@potentiel-domain/projet';

export const mapToReprésentantLégalModifiéTimelineItemProps = (
  modification: Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent,
) => {
  const { modifiéLe, modifiéPar, nomReprésentantLégal, typeReprésentantLégal } =
    modification.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Représentant légal modifié par {<span className="font-semibold">{modifiéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type : <span className="font-semibold">{typeReprésentantLégal}</span>
        </div>
        <div>
          Nom : <span className="font-semibold">{nomReprésentantLégal}</span>
        </div>
      </div>
    ),
  };
};

import { Lauréat } from '@potentiel-domain/projet';

export const mapToActionnaireModifiéTimelineItemProps = (
  record: Lauréat.Actionnaire.ActionnaireModifiéEvent,
) => {
  const { modifiéLe, modifiéPar, actionnaire } = record.payload;

  return {
    date: modifiéLe,
    title: <div>Actionnaire modifié par {<span className="font-semibold">{modifiéPar}</span>}</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
      </div>
    ),
  };
};

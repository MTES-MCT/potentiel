import { Lauréat } from '@potentiel-domain/projet';

export const mapToReprésentantLégalImportéTimelineItemProps = (
  modification: Lauréat.ReprésentantLégal.ReprésentantLégalImportéEvent,
) => {
  const { importéLe, nomReprésentantLégal } = modification.payload;

  return {
    date: importéLe,
    title: (
      <div>
        Représentant légal : {<span className="font-semibold">{nomReprésentantLégal}</span>}
      </div>
    ),
  };
};

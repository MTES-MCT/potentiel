import { Lauréat } from '@potentiel-domain/projet';

export const mapToReprésentantLégalImportéTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { importéLe, nomReprésentantLégal } =
    modification.payload as Lauréat.ReprésentantLégal.ReprésentantLégalImportéEvent['payload'];

  return {
    date: importéLe,
    title: (
      <div>
        Représentant légal : {<span className="font-semibold">{nomReprésentantLégal}</span>}
      </div>
    ),
  };
};

import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementReprésentantLégalEnregistréTimelineItemProps = (
  changement: Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent,
) => {
  const { enregistréLe, enregistréPar, nomReprésentantLégal, typeReprésentantLégal } =
    changement.payload;

  return {
    date: enregistréLe,
    title: (
      <div>
        Représentant légal modifié par {<span className="font-semibold">{enregistréPar}</span>}
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

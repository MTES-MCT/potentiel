import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementReprésentantLégalCorrigéTimelineItemProps = (
  demandeChangement: Lauréat.ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent,
) => {
  const { corrigéLe, corrigéPar, typeReprésentantLégal, nomReprésentantLégal } =
    demandeChangement.payload;

  return {
    date: corrigéLe,
    title: (
      <div>
        Demande de changement de représentant légal corrigée par{' '}
        {<span className="font-semibold">{corrigéPar}</span>}
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

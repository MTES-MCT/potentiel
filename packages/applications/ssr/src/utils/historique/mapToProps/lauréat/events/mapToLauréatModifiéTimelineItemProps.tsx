import { Lauréat } from '@potentiel-domain/projet';

export const mapToNomProjetModifiéTimelineItemProps = (
  modification: Lauréat.NomProjetModifiéEvent,
) => {
  const { nomProjet, modifiéLe, modifiéPar } = modification.payload;

  return {
    date: modifiéLe,
    title: (
      <div>Nom du projet modifié par {<span className="font-semibold">{modifiéPar}</span>}</div>
    ),
    content: (
      <div>
        Nouveau nom : <span className="font-semibold">{nomProjet}</span>
      </div>
    ),
  };
};

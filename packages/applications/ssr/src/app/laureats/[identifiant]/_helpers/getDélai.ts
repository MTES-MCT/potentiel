import { mediator } from 'mediateur';
import { Email, DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

export const getDemandeDélaiEnCoursInfos = async (
  identifiantProjet: IdentifiantProjet.RawType,
  emailUtilisateur: Email.RawType,
) => {
  const demandeDélai = await mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
    type: 'Lauréat.Délai.Query.ListerDemandeDélai',
    data: {
      utilisateur: emailUtilisateur,
      identifiantProjet,
      statuts: ['demandé'],
    },
  });

  return demandeDélai.items.length ? demandeDélai.items[0] : undefined;
};

type GetDateDernièreDemandeDélai = (args: {
  identifiantProjet: IdentifiantProjet.RawType;
  emailUtilisateur: Email.RawType;
}) => Promise<DateTime.RawType | undefined>;

export const getDateDernièreDemandeDélai: GetDateDernièreDemandeDélai = async ({
  identifiantProjet,
  emailUtilisateur,
}) => {
  const demandesDélai = await mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
    type: 'Lauréat.Délai.Query.ListerDemandeDélai',
    data: {
      utilisateur: emailUtilisateur,
      identifiantProjet,
    },
  });

  if (demandesDélai.total === 0) {
    return undefined;
  }

  const dateDernièreDemandeDélai = demandesDélai.items.reduce((acc, item) =>
    acc.demandéLe.estAntérieurÀ(item.demandéLe) ? item : acc,
  );

  return dateDernièreDemandeDélai.demandéLe.formatter();
};

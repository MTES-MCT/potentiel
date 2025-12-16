import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { TableauDeBordPage } from './TableauDeBord.page';
import { getAbandonAlert } from './_helpers/getAbandonAlert';
import { getAchèvementAlert } from './_helpers/getAchèvementAlert';
import { getAchèvementData } from './_helpers/getAchèvementData';
import { checkFeatureFlag } from './_helpers/checkFeatureFlag';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const { rôle } = utilisateur;

      checkFeatureFlag(identifiantProjet, searchParams);

      const abandon = await getAbandon(identifiantProjet);

      const achèvementData = await getAchèvementData({ identifiantProjet, rôle });

      const abandonAlert = getAbandonAlert({
        estAbandonné: !!abandon?.estAbandonné,
        rôle,
        identifiantProjet: identifiantProjet.formatter(),
        demandeEnCours: abandon?.demandeEnCours
          ? {
              dateDemandeEnCours: abandon.demandéLe.formatter(),
            }
          : undefined,
      });

      const achèvementAlert = getAchèvementAlert(achèvementData.value.estAchevé, rôle);

      return (
        <TableauDeBordPage
          identifiantProjet={identifiantProjet.formatter()}
          abandonAlert={abandonAlert}
          achèvementAlert={achèvementAlert}
        />
      );
    }),
  );
}

const getAbandon = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  return Option.isNone(abandon) ? undefined : abandon;
};

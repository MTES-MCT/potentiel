import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Période } from '@potentiel-domain/periode';

import {
  NotifierPériodePage,
  NotifierPériodePageProps,
} from '@/components/pages/période/notifier/NotifierPériode.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
      type: 'AppelOffre.Query.ListerAppelOffre',
      data: {},
    });

    const périodesNotifiées = await mediator.send<Période.ListerPériodesQuery>({
      type: 'Période.Query.ListerPériodes',
      data: {},
    });

    const appelOffresProps = mapToProps(appelOffres);

    for (const prop of appelOffresProps) {
      prop.périodes = prop.périodes.filter(
        (période) =>
          périodesNotifiées.items.find(
            (périodeNotifiée) =>
              périodeNotifiée.identifiantPériode.appelOffre === prop.identifiantAppelOffre &&
              périodeNotifiée.identifiantPériode.période === période.identifiantPériode,
          ) === undefined,
      );
    }

    return (
      <NotifierPériodePage
        appelOffres={appelOffresProps.filter((prop) => prop.périodes.length > 0)}
      />
    );
  });
}

const mapToProps = (
  readModel: AppelOffre.ListerAppelOffreReadModel,
): NotifierPériodePageProps['appelOffres'] =>
  readModel.items.map((appelOffre) => ({
    identifiantAppelOffre: appelOffre.id,
    libellé: appelOffre.shortTitle,
    périodes: appelOffre.periodes.map((periode) => ({
      identifiantPériode: periode.id,
      libellé: periode.title,
    })),
  }));

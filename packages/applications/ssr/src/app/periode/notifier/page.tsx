import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';

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
    return <NotifierPériodePage appelOffres={mapToProps(appelOffres)} />;
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

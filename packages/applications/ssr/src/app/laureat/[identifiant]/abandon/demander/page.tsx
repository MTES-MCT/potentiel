import { mediator } from 'mediateur';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getUser } from '@/utils/getUtilisateur';
import { redirect } from 'next/navigation';
import {
  DemanderAbandonPage,
  DemanderAbandonPageProps,
} from '@/components/pages/abandon/DemanderAbandonPage';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  const identifiantProjet = decodeURIComponent(identifiant);

  const utilisateur = await getUser();
  if (!utilisateur) {
    redirect('/login.html');
  }

  const candidature = await mediator.send<ConsulterCandidatureQuery>({
    type: 'CONSULTER_CANDIDATURE_QUERY',
    data: {
      identifiantProjet,
    },
  });

  // TODO: extract the logic in a dedicated function mapToProps
  // identifiantProjet must come from the readmodel as a value type
  const demanderAbandonPageProps: DemanderAbandonPageProps = {
    utilisateur,
    projet: { ...candidature, identifiantProjet },
  };

  return <DemanderAbandonPage {...{ ...demanderAbandonPageProps }} />;
}

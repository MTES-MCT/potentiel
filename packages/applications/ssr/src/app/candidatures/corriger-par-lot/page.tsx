import { Candidature } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { CorrigerCandidaturesParLotPage } from './CorrigerCandidaturesParLot.page';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Candidature.CorrigerCandidatureUseCase>(
        'Candidature.UseCase.CorrigerCandidature',
      );
      return <CorrigerCandidaturesParLotPage />;
    }),
  );
}

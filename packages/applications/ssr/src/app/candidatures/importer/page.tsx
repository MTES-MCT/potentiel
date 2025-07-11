import { Candidature } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ImporterCandidaturesPage } from './ImporterCandidatures.page';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<Candidature.ImporterCandidatureUseCase>(
        'Candidature.UseCase.ImporterCandidature',
      );
      return <ImporterCandidaturesPage />;
    }),
  );
}

import { Candidature } from '@potentiel-domain/projet';

import { ImporterCandidaturesPage } from '@/components/pages/candidature/importer/ImporterCandidatures.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

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

import { Candidature } from '@potentiel-domain/projet';

import { CorrigerCandidaturesPage } from '@/components/pages/candidature/corriger-par-lot/CorrigerCandidatures.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<Candidature.CorrigerCandidatureUseCase>(
        'Candidature.UseCase.CorrigerCandidature',
      );
      return <CorrigerCandidaturesPage />;
    }),
  );
}

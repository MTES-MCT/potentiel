import { Candidature } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { CorrigerPlusieursCandidaturesPage } from './CorrigerPlusieursCandidatures.page';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<Candidature.CorrigerCandidatureUseCase>(
        'Candidature.UseCase.CorrigerCandidature',
      );
      return <CorrigerPlusieursCandidaturesPage />;
    }),
  );
}

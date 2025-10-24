import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ImporterCandidaturesParCSVTestPage } from './ImporterCandidaturesParCSVTest.page';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<Candidature.ImporterCandidatureUseCase>(
        'Candidature.UseCase.ImporterCandidature',
      );

      if (process.env.APPLICATION_STAGE === 'production') {
        return notFound();
      }

      return <ImporterCandidaturesParCSVTestPage />;
    }),
  );
}

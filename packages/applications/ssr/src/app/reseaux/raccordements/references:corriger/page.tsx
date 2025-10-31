import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { CorrigerRéférencesDossierPage } from './CorrigerRéférencesDossier.page';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      );
      return <CorrigerRéférencesDossierPage />;
    }),
  );
}

import { Lauréat } from '@potentiel-domain/projet';

import { CorrigerRéférencesDossierPage } from '@/components/pages/réseau/raccordement/corriger-par-lot/CorrigerRéférencesDossier.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      );
      return <CorrigerRéférencesDossierPage />;
    }),
  );
}

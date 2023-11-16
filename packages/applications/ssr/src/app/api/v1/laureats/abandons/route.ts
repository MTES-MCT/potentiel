import { DateTime } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel/monitoring';
import { mediator } from 'mediateur';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const abandonsÀRelancer =
    await mediator.send<Abandon.ListerAbandonsAvecRecandidatureÀRelancerQuery>({
      type: 'LISTER_ABANDONS_AVEC_RECANDIDATURE_À_RELANCER_QUERY',
      data: {},
    });

  for (const { identifiantProjet } of abandonsÀRelancer.résultats) {
    try {
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_PREUVE_RECANDIDATURE_USECASE',
        data: {
          dateDemandeValue: DateTime.now().formatter(),
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });
    } catch (e) {
      getLogger().error(e as Error);
    }
  }

  return new Response(null, {
    status: 200,
    statusText: 'Ok',
  });
};

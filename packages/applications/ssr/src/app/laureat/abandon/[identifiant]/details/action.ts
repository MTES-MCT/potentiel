'use server';
import { mediator } from 'mediateur';

import { bootstrap } from '@/infrastructure/bootstrap';
import { Abandon } from '@potentiel-domain/laureat';

export async function instructionAbandonAction(prevState: any, formData: FormData) {
  bootstrap();

  const action = formData.get('action');
  const identifiantProjet = formData.get('identifiantProjet') as string;

  switch (action) {
    case 'confirmer':
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'CONFIRMER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet,
          utilisateurValue: 'pontoreau.sylvain@gmail.com',
          dateConfirmationValue: new Date().toISOString(),
        },
      });
      break;
    case 'annuler':
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ANNULER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet,
          utilisateurValue: 'pontoreau.sylvain@gmail.com',
          dateAnnulationValue: new Date().toISOString(),
        },
      });
  }
}

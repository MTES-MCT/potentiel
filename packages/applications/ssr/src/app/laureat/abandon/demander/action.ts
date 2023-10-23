'use server';
import { mediator } from 'mediateur';

import { bootstrap } from '@/infrastructure/bootstrap';
import { redirect } from 'next/navigation';
import { Abandon } from '@potentiel-domain/laureat';

export async function instructionAbandonAction(prevState: any, formData: FormData) {
  bootstrap();

  const identifiantProjet = formData.get('identifiantProjet') as string;
  const pièceJustificative = formData.get('piece-justificative') as File;
  const raison = formData.get('raison') as string;
  const recandidature = formData.get('recandidature') === 'true';

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'DEMANDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      utilisateurValue: 'pontoreau.sylvain@gmail.com',
      dateDemandeValue: new Date().toISOString(),
      pièceJustificativeValue: {
        content: pièceJustificative.stream(),
        format: pièceJustificative.type,
      },
      raisonValue: raison,
      recandidatureValue: recandidature,
    },
  });

  return redirect(`/laureat/abandon/${identifiantProjet}`);
}

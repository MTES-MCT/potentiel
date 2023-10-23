'use server';
import { mediator } from 'mediateur';

import { bootstrap } from '@/infrastructure/bootstrap';
import { redirect } from 'next/navigation';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

export async function instructionAbandonAction(prevState: any, formData: FormData) {
  bootstrap();

  const instruction = formData.get('instruction');
  const identifiantProjetValue = formData.get('identifiantProjet') as IdentifiantProjet.RawType;

  if (instruction === 'rejeter') {
    console.log('rejet');
    const file = formData.get('reponse-signee') as File;

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'REJETER_ABANDON_USECASE',
      data: {
        identifiantProjetValue,
        utilisateurValue: 'pontoreau.sylvain@gmail.com',
        dateRejetValue: new Date().toISOString(),
        réponseSignéeValue: {
          content: file.stream(),
          format: file.type,
        },
      },
    });
  }

  return redirect(`/app/abandon`);
}

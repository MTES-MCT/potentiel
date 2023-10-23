'use server';
import { mediator } from 'mediateur';

import { bootstrap } from '@/infrastructure/bootstrap';
import { redirect } from 'next/navigation';
import { Abandon } from '@potentiel-domain/laureat';

export async function instructionAbandonAction(prevState: any, formData: FormData) {
  bootstrap();

  const instruction = formData.get('instruction');
  const identifiantProjet = formData.get('identifiantProjet') as string;
  const réponseSignée = formData.get('reponse-signee') as File;

  switch (instruction) {
    case 'rejeter':
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'REJETER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet,
          utilisateurValue: 'pontoreau.sylvain@gmail.com',
          dateRejetValue: new Date().toISOString(),
          réponseSignéeValue: {
            content: réponseSignée.stream(),
            format: réponseSignée.type,
          },
        },
      });
      break;
    case 'accepter':
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ACCORDER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet,
          utilisateurValue: 'pontoreau.sylvain@gmail.com',
          dateAccordValue: new Date().toISOString(),
          réponseSignéeValue: {
            content: réponseSignée.stream(),
            format: réponseSignée.type,
          },
        },
      });
    case 'demander-confirmation':
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet,
          utilisateurValue: 'pontoreau.sylvain@gmail.com',
          dateDemandeValue: new Date().toISOString(),
          réponseSignéeValue: {
            content: réponseSignée.stream(),
            format: réponseSignée.type,
          },
        },
      });
      break;
  }

  return redirect(`/laureat/abandon/${identifiantProjet}`);
}

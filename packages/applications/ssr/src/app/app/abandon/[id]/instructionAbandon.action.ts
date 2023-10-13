'use server';
import { bootstrap } from '@/infrastructure/bootstrap';
import { redirect } from 'next/navigation';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  RawIdentifiantProjet,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnIdentifiantUtilisateur,
} from '@potentiel/domain';

export async function instructionAbandonAction(prevState: any, formData: FormData) {
  bootstrap();

  const instruction = formData.get('instruction');
  const identifiantProjet = formData.get('identifiantProjet') as RawIdentifiantProjet;
  console.log(instruction);

  if (instruction === 'rejeter') {
    console.log('rejet');
    const file = formData.get('reponse-signee') as File;

    await mediator.send<DomainUseCase>({
      type: 'REJETER_ABANDON_USECASE',
      data: {
        dateRejetAbandon: convertirEnDateTime(new Date()),
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        rejetéPar: convertirEnIdentifiantUtilisateur('pontoreau.sylvain@gmail.com'),
        réponseSignée: {
          content: file.stream(),
          format: file.type,
          type: 'abandon-rejeté',
        },
      },
    });
  }

  return redirect(`/app/abandon`);
}

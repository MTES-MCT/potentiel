'use server';
import { bootstrap } from '@/infrastructure/bootstrap';
import { redirect } from 'next/navigation';
import { mediator } from 'mediateur';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { AbandonUseCase } from '@potentiel-domain/laureat';

export async function instructionAbandonAction(prevState: any, formData: FormData) {
  bootstrap();

  const instruction = formData.get('instruction');
  const identifiantProjet = formData.get('identifiantProjet') as IdentifiantProjet.RawType;
  console.log(instruction);

  if (instruction === 'rejeter') {
    console.log('rejet');
    const file = formData.get('reponse-signee') as File;

    await mediator.send<AbandonUseCase>({
      type: 'REJETER_ABANDON_USECASE',
      data: {
        dateRejetAbandon: DateTime.convertirEnValueType({
          date: new Date(),
        }),
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        rejetéPar: IdentifiantUtilisateur.convertirEnValueType('pontoreau.sylvain@gmail.com'),
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

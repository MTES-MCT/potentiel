import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { DetailsCandidature } from '@/components/candidature/DetailsCandidature';
import { DetailsAbandon } from '@/components/laureat/abandon/DetailsAbandon';
import { StatutAbandonBadge } from '@/components/laureat/abandon/StatutAbandonBadge';

import { InstructionAbandonForm } from './instructionAbandon.form';
import { bootstrap } from '@/infrastructure/bootstrap';

bootstrap();

export default async function InstructionAbandonPage({
  params: { identifiant },
}: IdentifiantParameter) {
  const identifiantProjet = decodeURIComponent(identifiant);

  const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  const instructionPossible = !['accordé', 'rejeté'].includes(abandon?.statut || '');

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <h1 className="mb-10">Intruction de la demande d'abandon</h1>
      {abandon && (
        <div className="flex flex-col gap-4">
          <div>
            Status de l'abandon : <StatutAbandonBadge statut={abandon.statut} />
          </div>
          <div>
            <h2 className="mb-2">Convernant le projet :</h2>
            <DetailsCandidature identifiantProjet={identifiantProjet} />
          </div>

          <DetailsAbandon abandon={abandon} />

          {instructionPossible && <InstructionAbandonForm abandon={abandon} />}
        </div>
      )}
    </div>
  );
}

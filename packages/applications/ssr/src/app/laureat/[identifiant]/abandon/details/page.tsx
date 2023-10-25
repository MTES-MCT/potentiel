import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { DetailsCandidature } from '@/components/candidature/DetailsCandidature';
import { DetailsAbandon } from '@/components/laureat/abandon/DetailsAbandon';
import { StatutAbandonBadge } from '@/components/laureat/abandon/StatutAbandonBadge';

import { DetailsAbandonForm } from './detailsAbandon.form';
import { bootstrap } from '@/bootstrap';
import { redirect } from 'next/navigation';

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

  if (abandon.statut === 'rejeté') {
    redirect(`/laureat/${identifiant}/abandon/demander`);
  }

  const réponsePossible = abandon.statut === 'accordé';

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <h1 className="mb-10">Votre demande d'abandon</h1>
      {abandon && (
        <div className="flex flex-col gap-4">
          <div>
            <StatutAbandonBadge statut={abandon.statut} />
          </div>
          <div>
            <h2 className="mb-2">Convernant le projet :</h2>
            <DetailsCandidature identifiantProjet={identifiantProjet} />
          </div>

          <DetailsAbandon abandon={abandon} />

          {réponsePossible && <DetailsAbandonForm abandon={abandon} />}
        </div>
      )}
    </div>
  );
}

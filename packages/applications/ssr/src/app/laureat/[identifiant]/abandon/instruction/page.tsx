import { mediator } from 'mediateur';

import { bootstrap } from '@potentiel-application/bootstrap';
import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { DetailsCandidature } from '@/components/candidature/DetailsCandidature';
import { DetailsAbandon } from '@/components/laureat/abandon/DetailsAbandon';
import { StatutAbandonBadge } from '@/components/laureat/abandon/StatutAbandonBadge';

import { InstructionAbandonForm } from './instructionAbandon.form';

bootstrap();

export default async function InstructionAbandonPage({
  params: { identifiant },
}: IdentifiantParameter) {
  const identifiantProjet = decodeURIComponent(identifiant);

  const candidature = await mediator.send<ConsulterCandidatureQuery>({
    type: 'CONSULTER_CANDIDATURE',
    data: {
      identifiantProjet,
    },
  });

  const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <h1 className="mb-10">Intruction de la demande d'abandon</h1>
      <div className="flex flex-col gap-4">
        <div>
          <StatutAbandonBadge statut={abandon.statut} />
        </div>
        <div>
          <h2 className="mb-2">Convernant le projet :</h2>
          <DetailsCandidature candidature={candidature} />
        </div>

        <DetailsAbandon abandon={abandon} />

        {abandon.statut.estEnCours() && <InstructionAbandonForm abandon={abandon} />}
      </div>
    </div>
  );
}

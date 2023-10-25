import { mediator } from 'mediateur';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { DetailsCandidature } from '@/components/candidature/DetailsCandidature';
import { bootstrap } from '@/bootstrap';

import { DemanderAbandonForm } from './demanderAbandon.form';

bootstrap();

export default async function DemanderAbandonPage({
  params: { identifiant },
}: IdentifiantParameter) {
  const identifiantProjet = decodeURIComponent(identifiant);

  const candidature = await mediator.send<ConsulterCandidatureQuery>({
    type: 'CONSULTER_CANDIDATURE',
    data: {
      identifiantProjet,
    },
  });

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <h1 className="mb-10">Je demande un abandon de mon projet</h1>
      <div>
        <div className="mb-2">Convernant le projet :</div>
        <DetailsCandidature candidature={candidature} />
      </div>
      <DemanderAbandonForm identifiantProjet={identifiantProjet} />
    </div>
  );
}

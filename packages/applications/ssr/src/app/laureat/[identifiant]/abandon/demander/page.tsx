import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { DetailsCandidature } from '@/components/candidature/DetailsCandidature';
import { DemanderAbandonForm } from './demanderAbandon.form';

export default function DemanderAbandonPage({ params: { identifiant } }: IdentifiantParameter) {
  const identifiantProjet = decodeURIComponent(identifiant);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <h1 className="mb-10">Je demande un abandon de mon projet</h1>
      <div>
        <div className="mb-2">Convernant le projet :</div>
        <DetailsCandidature identifiantProjet={identifiantProjet} />
      </div>
      <DemanderAbandonForm identifiantProjet={identifiantProjet} />
    </div>
  );
}

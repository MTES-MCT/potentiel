'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import Select from '@codegouvfr/react-dsfr/Select';
import { Abandon } from '@potentiel-domain/laureat';
import { Heading2 } from '../../atoms/headings';

export const AbandonListFilters = () => {
  const pathname = usePathname();
  //   const router = useRouter();
  const searchParams = useSearchParams();
  const statut = searchParams.get('statut') ?? undefined;
  const recandidature = searchParams.get('recandidature') ?? undefined;

  return (
    <>
      <Heading2 className="mt-1 mb-6">Affiner la recherche</Heading2>
      <form method="GET" action={pathname}>
        <Select
          label="Recandidature"
          id="recandidature"
          nativeSelectProps={{
            name: 'recandidature',
            defaultValue: recandidature,
          }}
        >
          <option value="">Tous</option>
          <option value="true">Avec recandidature</option>
          <option value="false">Sans recandidature</option>
        </Select>
        <Select
          label="Statut"
          id="statut"
          nativeSelectProps={{
            name: 'statut',
            defaultValue: statut,
          }}
        >
          <option value="">Filtrer par statut</option>
          <option value={Abandon.StatutAbandon.accordé.statut}>
            {Abandon.StatutAbandon.accordé.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.annulé.statut}>
            {Abandon.StatutAbandon.annulé.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.confirmationDemandée.statut}>
            {Abandon.StatutAbandon.confirmationDemandée.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.confirmé.statut}>
            {Abandon.StatutAbandon.confirmé.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.demandé.statut}>
            {Abandon.StatutAbandon.demandé.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.rejeté.statut}>
            {Abandon.StatutAbandon.rejeté.libellé().toLocaleLowerCase()}
          </option>
        </Select>
        <Button className="mb-4">Filtrer</Button>
      </form>
    </>
  );
};

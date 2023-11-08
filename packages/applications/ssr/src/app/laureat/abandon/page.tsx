import { Tile } from '@/components/organisms/Tile';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { Pagination } from '@codegouvfr/react-dsfr/Pagination';
import { displayDate } from '@/utils/displayDate';

import { Abandon } from '@potentiel-domain/laureat';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { mediator } from 'mediateur';
import { FC } from 'react';

type PageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};

export default async function ListeAbandonsPage({ searchParams }: PageProps) {
  const recandidature =
    searchParams?.recandidature === 'true'
      ? true
      : searchParams?.recandidature === 'false'
      ? false
      : undefined;

  const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
    type: 'LISTER_ABANDONS_QUERY',
    data: {
      pagination: { page: 1, itemsPerPage: 10 },
      recandidature,
    },
  });

  return (
    <PageTemplate
      heading={`Demandes d'abandon${recandidature ? ' avec recandidature' : ''} (${
        abandons.items.length
      })`}
    >
      {abandons.items.length ? (
        <ul>
          {abandons.items.map((abandon) => (
            <li className="mb-6" key={`abandon-projet-${abandon.identifiantProjet.formatter()}`}>
              <Tile className="flex flex-col md:flex-row md:justify-between">
                <AbandonListItem abandon={abandon} />
              </Tile>
            </li>
          ))}
        </ul>
      ) : (
        <div>Aucune demande à afficher</div>
      )}
      <Pagination
        count={Math.ceil(abandons.totalItems / abandons.itemsPerPage)}
        defaultPage={searchParams?.page ? parseInt(searchParams.page) : 1}
        getPageLinkProps={(pageNumber) => ({
          href: `/laureat/abandon?recandidature=${
            recandidature ? 'true' : 'false'
          }&page=${pageNumber}`,
        })}
      />
    </PageTemplate>
  );
}

type AbandonListItemProps = {
  abandon: Abandon.ListerAbandonReadModel['items'][0];
};

const AbandonListItem: FC<AbandonListItemProps> = ({
  abandon: {
    identifiantProjet,
    nomProjet,
    statut: { statut },
    misÀJourLe,
    recandidature,
  },
}) => (
  <>
    <div>
      <div className="flex flex-col md:flex-row gap-3">
        <h2>
          Abandon du projet <span className="font-bold">{nomProjet}</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-2 py-2">
          <BadgeStatut statut={statut} />
          {recandidature && (
            <Badge noIcon small severity="info">
              avec recandidature
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 italic text-sm mt-2 sm:mt-0">
        <div>
          Appel d'offres : {identifiantProjet.appelOffre}
          <span className="hidden md:inline-block">,</span>
        </div>
        <div>Période : {identifiantProjet.période}</div>
        {identifiantProjet.famille && (
          <div>
            <span className="hidden md:inline-block">, Famille </span>
            {identifiantProjet.famille}
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-col justify-between mt-4 md:mt-2">
      <p className="italic text-sm">dernière mise à jour le {displayDate(misÀJourLe.date)}</p>
      <a
        href={`/demande/${encodeURIComponent(identifiantProjet.formatter())}/details.html`}
        className="self-end mt-2"
        aria-label={`voir le détail de la demande d'abandon en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </a>
    </div>
  </>
);

type BadgeStatutProps = {
  statut: Abandon.StatutAbandon.RawType;
};

const BadgeStatut: FC<BadgeStatutProps> = ({ statut }) => (
  <Badge
    noIcon
    severity={
      statut === 'demandé'
        ? 'new'
        : statut === 'accordé'
        ? 'success'
        : statut === 'rejeté'
        ? 'warning'
        : 'info'
    }
    small
    className="sm:ml-3"
  >
    {statut}
  </Badge>
);

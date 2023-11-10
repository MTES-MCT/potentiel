import { Tile } from '@/components/organisms/Tile';
import Badge from '@codegouvfr/react-dsfr/Badge';
import Tag from '@codegouvfr/react-dsfr/Tag';
import Select from '@codegouvfr/react-dsfr/Select';
import Button from '@codegouvfr/react-dsfr/Button';
import { displayDate } from '@/utils/displayDate';

import { Abandon } from '@potentiel-domain/laureat';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { mediator } from 'mediateur';
import { FC } from 'react';
import { Pagination } from '@/components/organisms/Pagination';
import { Heading2 } from '@/components/atoms/headings';

type PageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};

export default async function ListeAbandonsPage({ params, searchParams }: PageProps) {
  const page = params?.page ? parseInt(params.page) : 1;

  const getPageUrlForDismissedSearchParam = (dismissedSearchParam: string) => {
    const redirectionSearchParams = { ...searchParams };
    delete redirectionSearchParams[dismissedSearchParam];
    return `/laureat/abandon/${page}${
      redirectionSearchParams ? `?${new URLSearchParams(redirectionSearchParams).toString()}` : ''
    }`;
  };

  const recandidature =
    searchParams?.recandidature === 'true'
      ? true
      : searchParams?.recandidature === 'false'
      ? false
      : undefined;

  const statut = searchParams?.statut || undefined;

  const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
    type: 'LISTER_ABANDONS_QUERY',
    data: {
      pagination: { page, itemsPerPage: 10 },
      recandidature,
      ...(statut !== undefined && {
        statut: Abandon.StatutAbandon.convertirEnValueType(statut).statut,
      }),
    },
  });

  return (
    <PageTemplate heading="Abandon">
      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="flex flex-col pb-2 border-solid border-0 border-b md:border-b-0">
          <Heading2 className="mt-1 mb-6">Affiner la recherche</Heading2>
          <form method="GET" action={`/laureat/abandon/${page}`}>
            <Select
              label="Recandidature"
              id="recandidature"
              nativeSelectProps={{
                name: 'recandidature',
                defaultValue: searchParams?.recandidature,
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
        </div>
        {abandons.items.length ? (
          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {statut !== undefined && (
                <Tag
                  linkProps={{
                    href: getPageUrlForDismissedSearchParam('statut'),
                  }}
                  className="fr-tag--dismiss"
                >
                  {statut}
                </Tag>
              )}
              {recandidature !== undefined && (
                <Tag
                  linkProps={{
                    href: getPageUrlForDismissedSearchParam('recandidature'),
                  }}
                  className="fr-tag--dismiss"
                >
                  {recandidature ? 'avec' : 'sans'} recandidature
                </Tag>
              )}
              <p className="md:ml-auto my-2 font-semibold">
                {abandons.items.length} {abandons.items.length > 1 ? 'demandes' : 'demande'}{' '}
                d'abandon
                {recandidature === true
                  ? ' avec recandidature'
                  : recandidature === false
                  ? ' sans recandidature'
                  : ''}
              </p>
            </div>
            <ul>
              {abandons.items.map((abandon) => (
                <li
                  className="mb-6"
                  key={`abandon-projet-${abandon.identifiantProjet.formatter()}`}
                >
                  <Tile className="flex flex-col md:flex-row md:justify-between">
                    <AbandonListItem abandon={abandon} />
                  </Tile>
                </li>
              ))}
            </ul>
            <Pagination
              getPageUrl={(pageNumber) => {
                const urlSearchParams = new URLSearchParams(searchParams).toString();
                return `/laureat/abandon/${pageNumber}${urlSearchParams ? `?${searchParams}` : ''}`;
              }}
              currentPage={page}
              pageCount={Math.ceil(abandons.totalItems / abandons.itemsPerPage)}
            />
          </div>
        ) : (
          <div className="flex flex-grow">Aucun abandons à afficher</div>
        )}
      </div>
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

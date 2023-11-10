'use client';

import { FC } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import Button from '@codegouvfr/react-dsfr/Button';
import Select from '@codegouvfr/react-dsfr/Select';
import Tag from '@codegouvfr/react-dsfr/Tag';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { Abandon } from '@potentiel-domain/laureat';

import { Heading2 } from '../../atoms/headings';
import { Pagination } from '../../organisms/Pagination';
import { Tile } from '../../organisms/Tile';
import { PageTemplate } from '../../templates/PageTemplate';

type ListeAbandonsPageProps = {
  abandons: {
    items: Array<AbandonListItemProps>;
    totalItems: number;
    itemsPerPage: number;
  };
};

export const ListeAbandonsPage: FC<ListeAbandonsPageProps> = ({ abandons }) => {
  const pathname = usePathname();
  const router = useRouter();
  const page = +useParams<{ page: string }>().page;

  const searchParams = useSearchParams();
  const statut = searchParams.get('statut') ?? undefined;
  const recandidature = searchParams.get('recandidature') ?? undefined;

  return (
    <PageTemplate heading="Abandon">
      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="flex flex-col pb-2 border-solid border-0 border-b md:border-b-0">
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
        </div>
        {abandons.items.length ? (
          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {statut !== undefined && (
                <Tag
                  dismissible
                  nativeButtonProps={{
                    onClick: () => {
                      const urlSearchParams = new URLSearchParams(searchParams);
                      urlSearchParams.delete('statut');
                      const url = `${pathname}${
                        urlSearchParams.toString() !== '' ? `?${urlSearchParams.toString()}` : ''
                      }`;
                      router.push(url);
                    },
                  }}
                >
                  {statut}
                </Tag>
              )}
              {recandidature !== undefined && (
                <Tag
                  dismissible
                  nativeButtonProps={{
                    onClick: () => {
                      const urlSearchParams = new URLSearchParams(searchParams);
                      urlSearchParams.delete('recandidature');
                      const url = `${pathname}${
                        urlSearchParams.toString() !== '' ? `?${urlSearchParams.toString()}` : ''
                      }`;
                      router.push(url);
                    },
                  }}
                >
                  {recandidature ? 'avec' : 'sans'} recandidature
                </Tag>
              )}
              <p className="md:ml-auto my-2 font-semibold">
                {abandons.items.length} {abandons.items.length > 1 ? 'demandes' : 'demande'}{' '}
                d'abandon
                {recandidature === 'true'
                  ? ' avec recandidature'
                  : recandidature === 'false'
                  ? ' sans recandidature'
                  : ''}
              </p>
            </div>
            <ul>
              {abandons.items.map((abandon) => (
                <li className="mb-6" key={`abandon-projet-${abandon.identifiantProjet}`}>
                  <Tile className="flex flex-col md:flex-row md:justify-between">
                    <AbandonListItem {...abandon} />
                  </Tile>
                </li>
              ))}
            </ul>
            <Pagination
              getPageUrl={(pageNumber) => {
                const urlSearchParams = new URLSearchParams(searchParams).toString();
                return `/laureat/abandon/${pageNumber}${
                  urlSearchParams ? `?${urlSearchParams}` : ''
                }`;
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
};

type AbandonListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  statut: Abandon.StatutAbandon.RawType;
  misÀJourLe: string;
  recandidature: boolean;
};

const AbandonListItem: FC<AbandonListItemProps> = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  période,
  famille,
  statut,
  misÀJourLe,
  recandidature,
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
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 italic text-sm mt-2 sm:mt-0">
        <div>
          Appel d'offres : {appelOffre}
          <span className="hidden md:inline-block mr-2">,</span>
        </div>
        <div>Période : {période}</div>
        {famille && (
          <div>
            <span className="hidden md:inline-block mr-2">,</span>
            Famille : {famille}
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-col justify-between mt-4 md:mt-2">
      <p className="italic text-sm">dernière mise à jour le {misÀJourLe}</p>
      <a
        href={`/demande/${encodeURIComponent(identifiantProjet)}/details.html`}
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

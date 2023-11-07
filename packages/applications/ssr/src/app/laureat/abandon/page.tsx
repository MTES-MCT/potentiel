import { Tile } from '@/components/organisms/Tile';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { displayDate } from '@/utils/displayDate';
import { KeyIcon } from '@/components/atoms/icons';

import { Abandon } from '@potentiel-domain/laureat';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { mediator } from 'mediateur';

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
      <ul>
        {abandons.items.length &&
          abandons.items.map(
            ({
              identifiantProjet,
              nomProjet,
              statut,
              demandeDemandéLe,
              accordAccordéLe,
              rejetRejetéLe,
              confirmationDemandéeLe,
              confirmationConfirméLe,
            }) => (
              <li className="mb-6" key={`abandon-projet-${identifiantProjet}`}>
                <Tile className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h2>
                      Abandon du projet <span className="font-bold">{nomProjet}</span>
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
                    </h2>
                    <div className="flex flex-row italic text-sm mt-2 sm:mt-0">
                      <div className="self-center">
                        <KeyIcon aria-hidden />
                      </div>
                      <div>{identifiantProjet.replace(/#/g, ' - ')}</div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between mt-2 sm:mt-0">
                    <p className="italic text-sm">
                      dernière mise à jour le{' '}
                      {displayDate(
                        new Date(
                          rejetRejetéLe ??
                            accordAccordéLe ??
                            confirmationConfirméLe ??
                            confirmationDemandéeLe ??
                            demandeDemandéLe,
                        ),
                      )}
                    </p>
                    <a
                      href={`/demande/${encodeURIComponent(identifiantProjet)}/details.html`}
                      className="self-end"
                      aria-label={`voir le détail de la demande d'abandon en statut ${statut} pour le projet ${nomProjet}`}
                    >
                      voir le détail
                    </a>
                  </div>
                </Tile>
              </li>
            ),
          )}
        {!abandons.items.length && <div>Aucune demande à afficher</div>}
      </ul>
    </PageTemplate>
  );
}

import { Tile } from '@/components/organisms/Tile';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { displayDate } from '@/utils/displayDate';
import { KeyIcon } from '@/components/atoms/icons';

import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterCandidatureLegacyQuery } from '@potentiel/domain-views';
import { isSome } from '@potentiel/monads';
import { mediator } from 'mediateur';
import { PageTemplate } from '@/components/templates/PageTemplate';

export const dynamic = 'force-dynamic';

export default async function ListeAbandonsPage() {
  const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
    type: 'LISTER_ABANDONS_QUERY',
    data: {
      pagination: { page: 1, itemsPerPage: 10 },
    },
  });
  if (!abandons.items.length) {
    return (
      <PageTemplate heading1="Demandes d'abandon">
        <div>Aucune demande à afficher</div>
      </PageTemplate>
    );
  }
  const liste = await Promise.all(
    abandons.items.map(async (a) => {
      const projet = await mediator.send<ConsulterCandidatureLegacyQuery>({
        type: 'CONSULTER_CANDIDATURE_LEGACY_QUERY',
        data: {
          identifiantProjet: a.identifiantProjet,
        },
      });
      return {
        ...a,
        projet: isSome(projet) ? projet : undefined,
      };
    }),
  );
  return (
    <PageTemplate heading1={`Demandes d'abandon (${liste.length})`}>
      <ul>
        {liste.map(
          ({
            identifiantProjet,
            statut,
            demandeDemandéLe,
            accordAccordéLe,
            rejetRejetéLe,
            confirmationDemandéeLe,
            confirmationConfirméLe,
            projet,
          }) => (
            <li className="mb-6" key={`abandon-projet-${identifiantProjet}`}>
              <Tile className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h2>
                    Abandon du projet <span className="font-bold">{projet.nomProjet}</span>
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
                    href="http://"
                    className="self-end"
                    aria-label={`voir le détail de la demande d'abandon en statut ${statut} pour le projet ${projet.nomProjet}`}
                  >
                    voir le détail
                  </a>
                </div>
              </Tile>
            </li>
          ),
        )}
      </ul>
    </PageTemplate>
  );
}

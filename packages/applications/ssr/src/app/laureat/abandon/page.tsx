import { Heading1 } from '@/components/atoms/headings';
import { Tile } from '@/components/organisms/Tile';
import { Abandon } from '@potentiel-domain/laureat';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { displayDate } from '@/utils/displayDate';
import { KeyIcon } from '@/components/atoms/icons';

export default async function ListeAbandonsPage() {
  const liste: Abandon.ListerAbandonReadModel = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 3,
    items: [
      {
        nomProjet: 'Centrale solaire 1',
        identifiantProjet: 'PPE2 - Sol#1#1#test1',
        statut: 'accordé',
        demandeDemandéLe: new Date('2023-09-01').toISOString(),
        confirmationDemandéeLe: new Date('2023-10-01').toISOString(),
        confirmationConfirméLe: new Date('2023-10-05').toISOString(),
        accordAccordéLe: new Date('2023-09-10').toISOString(),
      },
      {
        nomProjet: 'Champ éolien 123',
        identifiantProjet: 'PPE2 - Eolien#2#1#test2',
        statut: 'demandé',
        demandeDemandéLe: new Date('2023-10-02').toISOString(),
      },
      {
        nomProjet: 'Centrale PV ombrière',
        identifiantProjet: 'PPE2 - Bâtiment#2#1#test3',
        statut: 'rejeté',
        demandeDemandéLe: new Date('2023-10-01').toISOString(),
        rejetRejetéLe: new Date('2023-10-03').toISOString(),
      },
      {
        nomProjet: 'Centrale PV Mairie',
        identifiantProjet: 'PPE2 - Bâtiment#3#1#test4',
        statut: 'confirmation demandée',
        demandeDemandéLe: new Date('2023-10-01').toISOString(),
        confirmationDemandéeLe: new Date('2023-10-08').toISOString(),
      },
      {
        nomProjet: 'Centrale solaire 12',
        identifiantProjet: 'PPE2 - Neutre#3#1#test5',
        statut: 'demande confirmée',
        demandeDemandéLe: new Date('2023-10-01').toISOString(),
        confirmationDemandéeLe: new Date('2023-10-08').toISOString(),
        confirmationConfirméLe: new Date('2023-10-15').toISOString(),
      },
    ],
  };

  return (
    <>
      <Heading1>Demandes d'abandon</Heading1>
      <ul>
        {liste.items.map(
          ({
            identifiantProjet,
            statut,
            demandeDemandéLe,
            accordAccordéLe,
            rejetRejetéLe,
            confirmationDemandéeLe,
            confirmationConfirméLe,
            nomProjet,
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
                    href="http://"
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
      </ul>
    </>
  );
}

import React from 'react';
import routes from '../../../../../routes';
import { PaginatedList } from '../../../../../modules/pagination';
import { Tile, MapPinIcon, Pagination, Link, KeyIcon } from '../../../../components';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { GarantiesFinancièresListItem } from '../../../../../modules/garantiesFinancières';
import { GarantiesFinancièresItem } from './GarantiesFinancièresItem';

export const Liste = ({
  className = '',
  listeGarantiesFinancières,
  currentUrl,
}: {
  className?: string;
  listeGarantiesFinancières: PaginatedList<GarantiesFinancièresListItem>;
  currentUrl: string;
}) => {
  return (
    <div className={className}>
      <ul className="p-0 m-0">
        {listeGarantiesFinancières.items.map(
          ({
            id,
            nomProjet,
            appelOffre: { title: appelOffreTitle, periode, famille },
            communeProjet,
            regionProjet,
            departementProjet,
            numeroCRE,
            garantiesFinancières,
          }) => (
            <li className="list-none p-0 m-0" key={id}>
              <Tile className="mb-8 flex md:relative flex-col gap-2" key={`project_${id}`}>
                <div className="flex flex-col gap-1">
                  <Link href={routes.PROJECT_DETAILS(id)}>{nomProjet}</Link>
                  <div className="flex flex-col md:flex-row md:gap-3">
                    <div className="text-xs italic">
                      <KeyIcon className="mr-1" />
                      {appelOffreTitle}-{periode}
                      {famille && `-${famille}`}-{numeroCRE}
                    </div>
                    <div className="p-0 m-0 mt-0 text-xs italic">
                      <MapPinIcon className="mr-1" />
                      {communeProjet}, {departementProjet}, {regionProjet}
                    </div>
                  </div>
                </div>
                <div>
                  <GarantiesFinancièresItem
                    garantiesFinancières={garantiesFinancières}
                    identifiantProjet={convertirEnIdentifiantProjet({
                      appelOffre: appelOffreTitle,
                      période: periode,
                      famille: famille,
                      numéroCRE: numeroCRE,
                    }).formatter()}
                    nomProjet={nomProjet}
                  />
                </div>
              </Tile>
            </li>
          ),
        )}
      </ul>
      {!Array.isArray(listeGarantiesFinancières) && (
        <Pagination
          pageCount={listeGarantiesFinancières.pageCount}
          currentPage={listeGarantiesFinancières.pagination.page}
          currentUrl={currentUrl}
        />
      )}
    </div>
  );
};

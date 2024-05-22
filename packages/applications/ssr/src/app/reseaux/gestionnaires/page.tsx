import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { GestionnaireRéseauListPage } from '@/components/pages/réseau/gestionnaire/lister/GestionnaireRéseauList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToPagination } from '@/utils/mapToPagination';
import { mapToRangeOptions } from '@/utils/mapToRangeOptions';

type PageProps = {
  searchParams?: Record<string, string>;
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const page = searchParams?.page ? parseInt(searchParams.page) : 1;
    const raisonSocialeSearch = searchParams ? searchParams['raisonSociale'] : '';

    const gestionnaireRéseaux =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {
          range: mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 10,
          }),
          ...(raisonSocialeSearch && {
            where: {
              raisonSociale: {
                operator: 'like',
                value: `%${raisonSocialeSearch}%`,
              },
            },
          }),
        },
      });

    return <GestionnaireRéseauListPage list={mapToListProps(gestionnaireRéseaux)} />;
  });
}

const mapToListProps = ({
  items,
  range,
  total,
}: GestionnaireRéseau.ListerGestionnaireRéseauReadModel): Parameters<
  typeof GestionnaireRéseauListPage
>[0]['list'] => {
  return {
    items: items.map(({ identifiantGestionnaireRéseau, raisonSociale }) => ({
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
      raisonSociale,
    })),
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};

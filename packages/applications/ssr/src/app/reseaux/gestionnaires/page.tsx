import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { mapToPlainObject } from '@potentiel-domain/core';

import { GestionnaireRéseauListPage } from '@/components/pages/réseau/gestionnaire/lister/GestionnaireRéseauList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToRangeOptions } from '@/utils/pagination';

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

    return <GestionnaireRéseauListPage {...mapToPlainObject(gestionnaireRéseaux)} />;
  });
}

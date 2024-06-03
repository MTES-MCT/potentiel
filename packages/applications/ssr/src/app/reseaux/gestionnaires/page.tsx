import { mediator } from 'mediateur';

import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { mapToPlainObject } from '@potentiel-domain/core';

import {
  GestionnaireRéseauListPage,
  GestionnaireWithRaccordementNumber,
} from '@/components/pages/réseau/gestionnaire/lister/GestionnaireRéseauList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToRangeOptions } from '@/utils/pagination';

type PageProps = {
  searchParams?: Record<string, string>;
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const page = searchParams?.page ? parseInt(searchParams.page) : 1;
    const raisonSocialeSearch = searchParams ? searchParams['raisonSociale'] : '';

    const gestionnairesRéseau =
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

    const gestionnairesRéseauWithRaccordements: GestionnaireWithRaccordementNumber[] = [];

    for (const gestionnaire of gestionnairesRéseau.items) {
      const nombreDeRaccordements =
        await mediator.send<Raccordement.ConsulterNombreDeRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterNombreDeRaccordement',
          data: {
            identifiantGestionnaireRéseauValue:
              gestionnaire.identifiantGestionnaireRéseau.formatter(),
          },
        });

      gestionnairesRéseauWithRaccordements.push({
        ...gestionnaire,
        nombreRaccordements: nombreDeRaccordements.nombreRaccordements,
      });
    }

    return (
      <GestionnaireRéseauListPage
        {...mapToPlainObject({
          ...gestionnairesRéseau,
          items: gestionnairesRéseauWithRaccordements,
        })}
      />
    );
  });
}

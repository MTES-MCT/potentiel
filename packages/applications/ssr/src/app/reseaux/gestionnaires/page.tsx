import { mediator } from 'mediateur';

import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { mapToPlainObject } from '@potentiel-domain/core';

import {
  GestionnaireRéseauListPage,
  GestionnaireAvecNombreDeRaccordement,
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

    const nombreRaccordementParGestionnaire: Record<string, number> = {};

    await Promise.all(
      gestionnairesRéseau.items.map(async (gestionnaire) => {
        const nombreDeRaccordements =
          await mediator.send<Raccordement.ConsulterNombreDeRaccordementQuery>({
            type: 'Réseau.Raccordement.Query.ConsulterNombreDeRaccordement',
            data: {
              identifiantGestionnaireRéseauValue:
                gestionnaire.identifiantGestionnaireRéseau.formatter(),
            },
          });

        nombreRaccordementParGestionnaire[gestionnaire.identifiantGestionnaireRéseau.codeEIC] =
          nombreDeRaccordements.nombreRaccordements;
      }),
    );

    const gestionnairesRéseauWithRaccordements: GestionnaireAvecNombreDeRaccordement[] =
      gestionnairesRéseau.items.map((gestionnaire) => ({
        ...gestionnaire,
        nombreRaccordements:
          nombreRaccordementParGestionnaire[gestionnaire.identifiantGestionnaireRéseau.codeEIC] ??
          0,
      }));

    const props = mapToPlainObject({
      ...gestionnairesRéseau,
      items: gestionnairesRéseauWithRaccordements,
    });

    return (
      <GestionnaireRéseauListPage items={props.items} range={props.range} total={props.total} />
    );
  });
}

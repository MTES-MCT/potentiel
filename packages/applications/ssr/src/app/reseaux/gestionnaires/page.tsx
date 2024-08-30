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
    const raisonSociale = searchParams ? searchParams['raisonSociale'] : '';

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.RechercherGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.RechercherGestionnaireRéseau',
        data: {
          range: mapToRangeOptions({
            currentPage: page,
          }),
          raisonSociale,
        },
      });

    console.log(gestionnairesRéseau.items);

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

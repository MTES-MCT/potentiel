import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToRangeOptions } from '@/utils/pagination';

import {
  GestionnaireRéseauListPage,
  GestionnaireAvecNombreDeRaccordement,
} from './GestionnaireRéseauList.page';

type PageProps = {
  searchParams?: {
    raisonSociale?: string;
    page?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const page = searchParams?.page ? parseInt(searchParams.page) : 1;
    const raisonSocialeSearch = searchParams?.raisonSociale;

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {
          range: mapToRangeOptions({
            currentPage: page,
          }),
          raisonSociale: raisonSocialeSearch,
        },
      });

    const nombreRaccordementParGestionnaire: Record<string, number> = {};

    await Promise.all(
      gestionnairesRéseau.items.map(async (gestionnaire) => {
        const nombreDeRaccordements =
          await mediator.send<Lauréat.Raccordement.ConsulterNombreDeRaccordementQuery>({
            type: 'Lauréat.Raccordement.Query.ConsulterNombreDeRaccordement',
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

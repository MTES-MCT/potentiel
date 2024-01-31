import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { GestionnaireRéseauListPage } from '@/components/pages/réseau/gestionnaire/lister/GestionnaireRéseauList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

type PageProps = {
  searchParams?: Record<string, string>;
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const page = searchParams?.page ? parseInt(searchParams.page) : 1;

    const gestionnaireRéseaux =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
        data: {
          pagination: { page, itemsPerPage: 10 },
        },
      });

    return <GestionnaireRéseauListPage list={mapToListProps(gestionnaireRéseaux)} />;
  });
}

const mapToListProps = (
  readModel: GestionnaireRéseau.ListerGestionnaireRéseauReadModel,
): Parameters<typeof GestionnaireRéseauListPage>[0]['list'] => {
  const items = readModel.items.map(({ identifiantGestionnaireRéseau, raisonSociale }) => ({
    identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
    raisonSociale,
  }));

  return {
    items,
    currentPage: readModel.currentPage,
    itemsPerPage: readModel.itemsPerPage,
    totalItems: readModel.totalItems,
  };
};

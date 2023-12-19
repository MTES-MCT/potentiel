'use client';

import { FC } from 'react';
import { GestionnaireRéseauListItem } from '@/components/molecules/réseau/gestionnaireRéseau/GestionnaireRéseauListItem';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { Heading1 } from '@/components/atoms/headings';
import { List } from '@/components/organisms/List';
import { ListHeader } from '@/components/organisms/ListHeader';
import Link from 'next/link';

type GestionnaireRéseauListPageProps = {
  list: {
    items: Array<Parameters<typeof GestionnaireRéseauListItem>[0]>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export const GestionnaireRéseauListPage: FC<GestionnaireRéseauListPageProps> = ({
  list: { items: gestionnaireRéseaux, currentPage, totalItems, itemsPerPage },
}) => {
  return (
    <PageTemplate banner={<Heading1 className="text-white">Gestionnaires réseaux</Heading1>}>
      <Link href="/reseau/gestionnaires/ajouter">Ajouter un gestionnaire</Link>
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <ListHeader tagFilters={[]} totalCount={totalItems} />
      </div>
      {gestionnaireRéseaux.length ? (
        <List
          items={gestionnaireRéseaux.map((gestionnaireRéseaux) => ({
            ...gestionnaireRéseaux,
            key: gestionnaireRéseaux.identifiantGestionnaireRéseau,
          }))}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          ItemComponent={GestionnaireRéseauListItem}
        />
      ) : (
        <div className="flex flex-grow">Aucun résultat à afficher</div>
      )}
    </PageTemplate>
    // <ListPageTemplate
    //   heading="Gestionnaires réseaux"
    //   items={gestionnaireRéseaux.map((gestionnaireRéseaux) => ({
    //     ...gestionnaireRéseaux,
    //     key: gestionnaireRéseaux.identifiantGestionnaireRéseau,
    //   }))}
    //   currentPage={currentPage}
    //   totalItems={totalItems}
    //   itemsPerPage={itemsPerPage}
    //   ItemComponent={GestionnaireRéseauListItem}
    //   filters={[]}
    //   tagFilters={[]}
    // />
  );
};

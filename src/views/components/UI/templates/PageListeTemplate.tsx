import React, { Children, ReactElement, ReactNode } from 'react';
import { PageTemplate, PageTemplateProps } from '../..';

/**
 * Fonction utilitaire permettant de trouver un nœud enfant correspondant à un type donné.
 * @param children Les nœuds enfants à parcourir.
 * @param slotType Le type de nœud que vous recherchez.
 * @returns Le premier nœud enfant correspondant ou null s'il n'y en a pas.
 */
function findSlotOfType(children: ReactNode, slotType: React.ElementType): ReactElement | null {
  const child = Children.toArray(children).find((child) => {
    if (React.isValidElement(child)) {
      return child.type === slotType;
    }
    return false;
  });

  if (!child) {
    return null;
  }

  return child as ReactElement;
}

type TopBarProps = {
  children: React.ReactNode;
  success?: string;
  error?: string;
};
const TopBar = ({ children, success, error }: TopBarProps) => (
  <div
    className={`flex flex-col lg:flex-row lg:items-end lg:justify-between ${
      (success || error) && 'mt-4'
    }`}
  >
    {children}
  </div>
);

type FiltresProps = {
  children: React.ReactNode;
  filtersOpen: boolean;
};
const Filtres = ({ children, filtersOpen }: FiltresProps) => (
  <div
    className={`flex flex-col max-w-xl ${
      filtersOpen ? 'lg:w-1/3 lg:self-start lg:sticky lg:top-10 lg:max-w-none' : 'lg:hidden'
    }`}
  >
    {children}
  </div>
);

type ListeProps = {
  children: React.ReactNode;
  filtersOpen: boolean;
};
const Liste = ({ children, filtersOpen }: ListeProps) => (
  <div className={filtersOpen ? 'lg:w-2/3' : 'lg:w-full'}>{children}</div>
);

export const PageListeTemplate: React.FC<PageTemplateProps> & {
  TopBar: typeof TopBar;
  Filtres: typeof Filtres;
  Liste: typeof Liste;
} = ({ user, children, currentPage, contentHeader }) => {
  const TopBarComponent = findSlotOfType(children, TopBar);
  const FiltresComponent = findSlotOfType(children, Filtres);
  const ListeComponent = findSlotOfType(children, Liste);
  return (
    <PageTemplate user={user} contentHeader={contentHeader} currentPage={currentPage}>
      {TopBarComponent}
      <div className="flex flex-col mt-4 lg:flex-row lg:mt-8 gap-10">
        {FiltresComponent}
        {ListeComponent}
      </div>
    </PageTemplate>
  );
};

PageListeTemplate.TopBar = TopBar;
PageListeTemplate.Filtres = Filtres;
PageListeTemplate.Liste = Liste;

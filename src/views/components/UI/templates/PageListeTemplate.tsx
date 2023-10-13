import React, { Children, ReactElement, ReactNode } from 'react';
import { ErrorBox, PageTemplate, PageTemplateProps, SuccessBox } from '@potentiel/ui';

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
  <>
    {success && <SuccessBox title={success} />}
    {error && <ErrorBox title={error} />}
    <div
      className={`flex flex-col lg:flex-row lg:items-end lg:justify-between ${
        (success || error) && 'mt-4'
      }`}
    >
      {children}
    </div>
  </>
);

type SideBarProps = {
  children: React.ReactNode;
  open: boolean;
};
const SideBar = ({ children, open }: SideBarProps) => (
  <div
    className={`flex flex-col max-w-xl ${
      open ? 'lg:w-1/3 lg:self-start lg:sticky lg:top-10 lg:max-w-none' : 'lg:hidden'
    }`}
  >
    {children}
  </div>
);

type ListProps = {
  children: React.ReactNode;
  sideBarOpen: boolean;
};
const List = ({ children, sideBarOpen }: ListProps) => (
  <div className={sideBarOpen ? 'lg:w-2/3' : 'lg:w-full'}>{children}</div>
);

/** @deprecated Avoir un template de page liste sous entends qu'une page avec une liste n'a rien d'autre or ceci n'est pas vrai et très restrictif. Il faut avoir un composant List qui inclu la logique avec filtre, etc... */
export const PageListeTemplate: React.FC<PageTemplateProps> & {
  TopBar: typeof TopBar;
  SideBar: typeof SideBar;
  List: typeof List;
} = ({ user, children, currentPage, contentHeader }) => {
  const TopBarComponent = findSlotOfType(children, TopBar);
  const SideBarComponent = findSlotOfType(children, SideBar);
  const ListComponent = findSlotOfType(children, List);
  return (
    <PageTemplate user={user} contentHeader={contentHeader} currentPage={currentPage}>
      {TopBarComponent}
      <div className="flex flex-col mt-4 lg:flex-row lg:mt-8 gap-10">
        {SideBarComponent}
        {ListComponent}
      </div>
    </PageTemplate>
  );
};

PageListeTemplate.TopBar = TopBar;
PageListeTemplate.SideBar = SideBar;
PageListeTemplate.List = List;

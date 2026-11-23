import { fr } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import { Icon, type IconProps } from '../atoms/Icon';

declare global {
  interface Window {
    dsfr: (element: HTMLElement) => { collapse: { conceal: () => void } };
  }
}

export type DropDownMenuItem = {
  iconId?: IconProps['id'];
  label: string;
  onClick: () => void;
};

export type DropDownMenuProps = {
  items: DropDownMenuItem[];
  children: React.ReactNode;
};

export type CreateDropDownMenuProps = {
  id: string;
};

/** Ce composant s'inspire de composants existants du DSFR pour recréer le comportement d'un menu déroulant, non existant tel-quel. */
export const createDropDownMenu = ({ id }: CreateDropDownMenuProps) => {
  return {
    getButtonProps: () => ({
      'aria-controls': id,
      'aria-expanded': false,
    }),
    Component: ({ items, children }: DropDownMenuProps) => {
      const dropdownRef = useRef<HTMLDivElement>(null);
      const menuRef = useRef<HTMLDivElement>(null);

      // Fermer la dropdown au click en dehors de la zone.
      useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
          if (
            event.target instanceof Node &&
            !dropdownRef.current?.contains(event.target) &&
            menuRef.current?.classList.contains('fr-collapse--expanded')
          ) {
            window.dsfr(menuRef.current).collapse.conceal();
          }
        };

        document.addEventListener('click', closeOnOutsideClick);
        return () => document.removeEventListener('click', closeOnOutsideClick);
      }, []);

      return (
        <div className="relative" ref={dropdownRef}>
          {children}
          <div className={clsx(fr.cx('fr-collapse', 'fr-menu'), 'right-0')} id={id} ref={menuRef}>
            <ul className={fr.cx('fr-menu__list')}>
              {items.map(({ iconId, label, onClick }) => (
                <li key={label}>
                  <button
                    type="button"
                    className={'fr-nav__link'}
                    onClick={(e) => {
                      e.preventDefault();
                      onClick();
                    }}
                  >
                    <span className="flex gap-3">
                      {iconId && <Icon id={iconId} />}
                      <span className="short-label">{label}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    },
  };
};

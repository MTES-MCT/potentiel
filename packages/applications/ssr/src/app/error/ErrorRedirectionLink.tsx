'use client';

import { fr } from '@codegouvfr/react-dsfr';
import { usePathname } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { Link } from '@/components/atoms/LinkNoPrefetch';
import { decodeParameter } from '@/utils/decodeParameter';

export const ErrorRedirectionLink = () => {
  const pathname = usePathname();

  const identifiantProjet = pathname.match(/^\/(laureats|elimines)\/(?<identifiant>[^/]+)\/.*/)
    ?.groups?.identifiant;

  return (
    <ul className={fr.cx('fr-btns-group', 'fr-btns-group--inline-md')}>
      <li>
        {identifiantProjet ? (
          <Link
            className={fr.cx('fr-btn')}
            href={Routes.Projet.details(decodeParameter(identifiantProjet))}
          >
            Retour à la page projet
          </Link>
        ) : (
          <Link className={fr.cx('fr-btn')} href="/">
            Page d'accueil
          </Link>
        )}
      </li>
    </ul>
  );
};

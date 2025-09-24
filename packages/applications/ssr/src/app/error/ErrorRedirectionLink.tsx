'use client';

import { fr } from '@codegouvfr/react-dsfr';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

export const ErrorRedirectionLink = () => {
  const { identifiant } = useParams<{ identifiant?: string }>();
  const pathname = usePathname();

  const identifiantProjet =
    pathname.startsWith('/laureats/') || pathname.startsWith('/elimine/') ? identifiant : null;

  return (
    <ul className={fr.cx('fr-btns-group', 'fr-btns-group--inline-md')}>
      <li>
        {identifiantProjet ? (
          <Link className={fr.cx('fr-btn')} href={Routes.Projet.details(identifiantProjet)}>
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

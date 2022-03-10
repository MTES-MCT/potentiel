import React from 'react'
import routes from '../../routes'
import { Request } from 'express'
import { ExternalLinkIcon, UserIcon } from '@heroicons/react/solid'

interface HeaderProps {
  request: Request
}

const Header = ({ request }: HeaderProps) => {
  const user = request.user
  return (
    <div className="only-dsfr">
      <header
        className="fr-header flex flex-wrap items-center justify-between fr-container"
        style={{ boxShadow: 'none', padding: 0 }}
      >
        <div className="order-1">
          <p className="fr-logo">
            République
            <br />
            Française
          </p>
        </div>
        <div className="fr-header__service order-3 sm:order-2 sm:grow">
          <a href="/" title="Accueil - Potentiel - Ministère de la transition écologique">
            <p className="fr-header__service-title text-black">Potentiel</p>
          </a>
          <p className="fr-header__service-tagline">
            Facilite le parcours des producteurs
            <br />
            d'énergies renouvelables électriques
          </p>
        </div>
        <nav className="order-2 sm:order-3 text-right mr-2 mt-2">
          <ul className="flex flex-col sm:flex-row gap-3 fr-links-group">
            {user ? (
              <>
                <li>
                  {['admin', 'dgec'].includes(user.role) ? (
                    <a className="fr-link fr-fi-user-line" href={user.accountUrl}>
                      {user.fullName}
                    </a>
                  ) : (
                    <span
                      className="fr-link fr-fi-user-line"
                      style={{ color: 'var(--text-default-grey)' }}
                    >
                      {user.fullName}
                    </span>
                  )}
                </li>
                <li>
                  <a className="fr-link fr-fi-logout-box-r-line" href={routes.LOGOUT_ACTION}>
                    Me déconnecter
                  </a>
                </li>
              </>
            ) : (
              <li>
                <a className="fr-link fr-fi-account-line" href={routes.LOGIN}>
                  M'identifier
                </a>
              </li>
            )}
            <li className="list-none">
              <a
                target="_blank"
                rel="noopener"
                href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
                className="fr-link fr-fi-external-link-line"
              >
                Aide
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default Header

import React from 'react'
import routes from '../../routes'
import { Request } from 'express'

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
                <li
                  className="fr-link fr-fi-user-line justify-end"
                  style={{ color: 'var(--text-default-grey)' }}
                >
                  {user.fullName}
                </li>
                <li className="fr-link fr-fi-logout-box-r-line">
                  <a href={routes.LOGOUT_ACTION}>Me déconnecter</a>
                </li>
              </>
            ) : (
              <li className="fr-link fr-fi-account-line">
                <a href={routes.LOGIN}>M'identifier</a>
              </li>
            )}
            <li className="list-none">
              <a
                target="_blank"
                rel="noopener"
                href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
                className="fr-link fr-fi-external-link-line fr-link--icon-right"
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

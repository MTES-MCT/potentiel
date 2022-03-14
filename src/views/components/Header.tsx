import React from 'react'
import routes from '../../routes'
import { User } from '@entities'
import { Request } from 'express'

interface HeaderProps {
  request: Request
}

const Header = ({ request }: HeaderProps) => {
  const user = request.user
  return (
    <div className="only-dsfr">
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <p className="fr-logo">
                      République
                      <br />
                      Française
                    </p>
                  </div>
                  <div className="fr-header__navbar">
                    <button
                      className="fr-btn--menu fr-btn"
                      data-fr-opened="false"
                      aria-controls="modal-833"
                      aria-haspopup="menu"
                      title="Menu"
                      id="fr-btn-menu-mobile"
                    >
                      Menu
                    </button>
                  </div>
                </div>
                <div className="fr-header__service">
                  <a href="/" title="Accueil - Potentiel - Ministère de la transition écologique">
                    <p className="fr-header__service-title text-black">Potentiel</p>
                  </a>
                  <p className="fr-header__service-tagline">
                    Facilite le parcours des producteurs d'énergies renouvelables électriques
                  </p>
                </div>
              </div>
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  <ul className="fr-links-group">
                    <li>
                      {user ? (
                        <>
                          <span>{user.fullName}</span>
                          <a
                            className="fr-link fr-fi-logout-box-r-line"
                            href={routes.LOGOUT_ACTION}
                          >
                            Me déconnecter
                          </a>
                        </>
                      ) : (
                        <a className="fr-link fr-fi-account-line" href={routes.LOGIN}>
                          M'identifier
                        </a>
                      )}
                    </li>
                    <li>
                      <a
                        className="fr-link fr-fi-external-link-line fr-link--icon-right"
                        target="_blank"
                        rel="noopener"
                        href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
                      >
                        Guide d'utilisation
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header

import React from 'react'

const Footer = () => {
  return (
    <div className="only-dsfr mt-auto">
      <footer className="fr-footer" role="contentinfo" id="footer">
        <div className="fr-container">
          <div className="fr-footer__body">
            <div className="fr-footer__brand fr-enlarge-link">
              <a href="/" title="Retour à l’accueil">
                <p className="fr-logo" title="république française">
                  Ministère
                  <br />
                  de la transition
                  <br />
                  énergétique
                </p>
              </a>
            </div>
            <div className="fr-footer__content">
              <p className="fr-footer__content-desc">
                Suivez efficacement vos projets :<br />
                Transmettez vos documents, demandez des modifications.
              </p>
              <ul className="fr-footer__content-list">
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" href="https://legifrance.gouv.fr">
                    legifrance.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" href="https://gouvernement.fr">
                    gouvernement.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" href="https://service-public.fr">
                    service-public.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" href="https://data.gouv.fr">
                    data.gouv.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="fr-footer__bottom">
            <ul className="fr-footer__bottom-list">
              <li className="fr-footer__bottom-item">
                <span className="fr-footer__bottom-link">Accessibilité: non conforme</span>
              </li>
              <li className="fr-footer__bottom-item">
                <a
                  className="fr-footer__bottom-link"
                  href="https://docs.potentiel.beta.gouv.fr/info/cgu"
                >
                  Mentions légales
                </a>
              </li>
              <li className="fr-footer__bottom-item">
                <a
                  className="fr-footer__bottom-link"
                  href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
                >
                  Guide d'utilisation
                </a>
              </li>
              <li className="fr-footer__bottom-item">
                <a
                  className="fr-footer__bottom-link"
                  href="https://potentiel.beta.gouv.fr/stats.html"
                >
                  Statistiques
                </a>
              </li>
              <li className="fr-footer__bottom-item">
                <a
                  className="fr-footer__bottom-link"
                  href="https://docs.potentiel.beta.gouv.fr/info/cgu#cookies"
                >
                  Gestion des cookies
                </a>
              </li>
              <li className="fr-footer__bottom-item">
                <span className="fr-footer__bottom-link">
                  Version {process.env.npm_package_version}
                </span>
              </li>
            </ul>
            <div className="fr-footer__bottom-copy">
              <p>
                Sauf mention contraire, tous les contenus de ce site sont sous{' '}
                <a
                  href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                  target="_blank"
                >
                  licence etalab-2.0
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export { Footer }

import React from 'react'

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <ul className="footer__links">
          <li>
            <img
              style={{ maxWidth: '100%' }}
              src="/images/MIN_Transition_Ecologique_RVB_petit.png"
              alt="Logo du ministère de la transition énergétique"
              width="300"
              height="215"
            />
          </li>
          <li>
            <a href="https://docs.potentiel.beta.gouv.fr/info/cgu">
              Mentions Légales et Conditions Générales d‘Utilisation
            </a>
          </li>
          <li>
            <a href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel">
              Guide d‘utilisation
            </a>
          </li>
          <li>
            <a href="https://potentiel.beta.gouv.fr/stats.html">Statistiques</a>
          </li>
          <li>
            <a href="https://docs.potentiel.beta.gouv.fr/info/cgu#cookies">
              Notre politique de cookies
            </a>
          </li>
        </ul>
        <div>{process.env.npm_package_version}</div>
      </div>
    </footer>
  )
}

export default Footer

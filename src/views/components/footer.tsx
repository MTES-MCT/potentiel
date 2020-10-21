import React from 'react'
import routes from '../../routes'
import { version } from '../../../package.json'

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <ul className="footer__links">
          <li>
            <img style={{ maxWidth: "100%" }} src="/images/MIN_Transition_Ecologique_RVB_petit.png" alt="Logo du ministère de la transition énergétique" width="300" />
          </li>

          <li>
            <a href="https://www.data.gouv.fr/terms">
              Conditions générales d'utilisation
            </a>
          </li>
        </ul>
        <ul className="footer__links"></ul>
        <div>{version}</div>
      </div>
    </footer>
  )
}

export default Footer

import { fr } from '@codegouvfr/react-dsfr';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

export default function VerifyRequest() {
  return (
    <PageTemplate>
      <div className={fr.cx('fr-container')}>
        <div
          className={fr.cx(
            'fr-my-7w',
            'fr-mt-md-12w',
            'fr-mb-md-10w',
            'fr-grid-row',
            'fr-grid-row--gutters',
            'fr-grid-row--middle',
            'fr-grid-row--center',
          )}
        >
          <div className={fr.cx('fr-py-0', 'fr-col-12', 'fr-col-md-6')}>
            <Heading1>Vérifiez votre boîte de réception</Heading1>
            <p className={fr.cx('fr-text--sm', 'fr-mb-3w')}>
              Nous vous avons envoyé un courriel avec un lien unique de connexion valable 15
              minutes. Celui-ci vous permettra d'accéder à Potentiel sans saisir de mot de passe.
            </p>

            <p className={fr.cx('fr-text--sm', 'fr-mb-3w')}>
              Si après plusieurs minutes vous n'avez pas reçu de courriel, vous pouvez toujours
              réessayer retrounant sur la page de connexion grâce au bouton ci-dessous. Si
              malheureusement le problème persiste, n'hésitez pas à nous contacter ou bien à choisir
              un autre mode de connexion.
            </p>
            <ul className={fr.cx('fr-btns-group', 'fr-btns-group--inline-md')}>
              <li>
                <a className={fr.cx('fr-btn')} href={Routes.Auth.signIn()}>
                  Retour au choix de connexion
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

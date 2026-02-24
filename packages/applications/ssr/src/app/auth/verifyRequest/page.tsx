import { redirect } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default function VerifyRequest() {
  return PageWithErrorHandling(async () => {
    const utilisateur = getContext()?.utilisateur;
    if (utilisateur) {
      redirect(Routes.Auth.redirectToDashboard());
    }

    console.log(auth.options.plugins.find((x) => x.id === 'magic-link')?.options);
    const expiresInSeconds =
      auth.options.plugins.find((x) => x.id === 'magic-link')?.options.expiresIn ?? 60 * 5;

    return (
      <PageTemplate>
        <div className="flex flex-col gap-4 md:mt-5 md:mx-auto md:max-w-lg">
          <Heading1>Vérifiez votre boîte de réception</Heading1>
          <p>
            Nous vous avons envoyé un courriel avec un lien unique de connexion valable{' '}
            {expiresInSeconds / 60} minutes. Celui-ci vous permettra d'accéder à Potentiel sans
            saisir de mot de passe.
          </p>

          <p>
            Si après plusieurs minutes vous n'avez pas reçu de courriel, nous vous invitons à
            retourner sur la page de connexion en cliquant sur le bouton ci dessous.
          </p>

          <p>
            Si malheureusement le problème persiste, n'hésitez pas à nous contacter à l'adresse
            contact@potentiel.beta.gouv.fr.
          </p>

          <Button linkProps={{ href: Routes.Auth.signIn() }}>Retour au choix de connexion</Button>
        </div>
      </PageTemplate>
    );
  });
}

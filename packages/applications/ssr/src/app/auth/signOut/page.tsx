import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { getLogoutUrl } from '@potentiel-applications/request-context';

import { PageTemplate } from '@/components/templates/Page.template';
import { SignOutRedirect } from '@/components/molecules/SignOutRedirect';

export default async function SignOut() {
  const { BASE_URL = '' } = process.env;

  const session = await getServerSession({
    callbacks: {
      session({ session, token }) {
        session.idToken = token.idToken;
        return session;
      },
    },
  });
  if (!session) {
    return redirect(BASE_URL);
  }

  const callbackUrl =
    session.idToken &&
    (await getLogoutUrl(
      {
        id_token_hint: session.idToken,
        post_logout_redirect_uri: BASE_URL,
      },
      'proconnect',
    ));
  return (
    <PageTemplate>
      <div className="flex m-auto">
        <SignOutRedirect callbackUrl={callbackUrl} />
        <div className="font-bold text-2xl">Déconnexion en cours, merci de patienter ...</div>
      </div>
    </PageTemplate>
  );
}

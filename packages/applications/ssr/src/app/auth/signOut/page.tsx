import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { getLogoutUrl } from '@potentiel-applications/request-context';

import { PageTemplate } from '@/components/templates/Page.template';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { SignOutRedirect } from './SignOutRedirect';

type PageProps = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default async function SignOut({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
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
      redirect(searchParams?.callbackUrl ?? '/');
    }

    const callbackUrl = session.idToken
      ? await getLogoutUrl({
          id_token_hint: session.idToken,
          post_logout_redirect_uri: BASE_URL,
        })
      : searchParams?.callbackUrl;

    return (
      <PageTemplate>
        <div className="flex m-auto">
          <SignOutRedirect callbackUrl={callbackUrl} />
          <div className="font-bold text-2xl">Déconnexion en cours, merci de patienter ...</div>
        </div>
      </PageTemplate>
    );
  });
}

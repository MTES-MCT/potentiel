import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { redirect } from 'next/navigation';

import { getLogoutUrl } from '@potentiel-applications/request-context';

import { PageTemplate } from '@/components/templates/Page.template';
import { SignOutRedirect } from '@/components/molecules/SignOutRedirect';
import { SignOutProConnect } from '@/components/molecules/SignOutProConnect';

type PageProps = {
  searchParams: {
    proConnectNotAvailableForUser?: string;
    idToken?: string;
  };
};

const searchParamsSchema = z.object({
  proConnectNotAvailableForUser: z
    .literal('true')
    .optional()
    .transform((s) => s === 'true'),
  idToken: z.string().optional(),
});

export default async function SignOut({ searchParams }: PageProps) {
  const { BASE_URL = '' } = process.env;
  const { proConnectNotAvailableForUser, idToken } = searchParamsSchema.parse(searchParams);
  const session = await getServerSession({
    callbacks: {
      session({ session, token }) {
        session.idToken = token.idToken;
        return session;
      },
    },
  });
  if (session) {
    const callbackUrl = await getLogoutUrl({
      id_token_hint: session.idToken,
      post_logout_redirect_uri: BASE_URL,
    });
    return (
      <PageTemplate>
        <div className="flex m-auto">
          <SignOutRedirect callbackUrl={callbackUrl} />
          <div className="font-bold text-2xl">Déconnexion en cours, merci de patienter ...</div>
        </div>
      </PageTemplate>
    );
  }

  if (proConnectNotAvailableForUser) {
    const callbackUrl = idToken
      ? await getLogoutUrl(
          {
            id_token_hint: idToken,
            post_logout_redirect_uri: BASE_URL,
          },
          'proconnect',
        )
      : BASE_URL;
    return (
      <PageTemplate>
        <SignOutProConnect callbackUrl={callbackUrl} />
      </PageTemplate>
    );
  }

  redirect('/');
}

import { headers } from 'next/headers';

import { PageTemplate } from '@/components/templates/Page.template';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { auth } from '@/auth';

import { SignOutRedirect } from './SignOutRedirect';

export default async function SignOut() {
  return PageWithErrorHandling(async () => {
    await auth.api.signOut({ headers: headers() });

    // if (!session) {
    //   redirect('/');
    // }

    // const callbackUrl = session.idToken
    //   ? await getLogoutUrl({
    //       id_token_hint: session.idToken,
    //       post_logout_redirect_uri: BASE_URL,
    //     })
    //   : undefined;

    return (
      <PageTemplate>
        <div className="flex m-auto">
          <SignOutRedirect callbackUrl={''} />
          <div className="font-bold text-2xl">Déconnexion en cours, merci de patienter ...</div>
        </div>
      </PageTemplate>
    );
  });
}

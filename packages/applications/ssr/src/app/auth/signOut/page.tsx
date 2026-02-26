import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { PageTemplate } from '@/components/templates/Page.template';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { auth } from '@/auth';
import { getLogoutUrl } from '@/auth/getLogoutUrl';

import { SignOutRedirect } from './SignOutRedirect';

export default async function SignOut() {
  return PageWithErrorHandling(async () => {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) {
      redirect('/');
    }
    const callbackUrl = await getLogoutUrl(session.user.provider);
    await auth.api.signOut({ headers: headers() });

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

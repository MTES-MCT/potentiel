import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import z from 'zod';

import { Routes } from '@potentiel-applications/routes';

import { getSessionUser } from '@/auth/getSessionUser';
import { AuthProvider, getProviders } from '@/auth/providers/authProvider';
import { getLastUsedProvider } from '@/auth/providers/getLastUsedProvider';
import { ProviderProps } from '@/components/organisms/auth/AuthTile';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { callbackURLSchema } from '@/utils/zod/auth';

import SignInPage from './SignIn.page';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

const searchParamsSchema = z.object({
  callbackUrl: callbackURLSchema.optional(),
  forceProConnect: z.stringbool().optional(),
});

export default async function SignIn(props: PageProps) {
  const searchParams = await props.searchParams;
  return PageWithErrorHandling(async () => {
    const { callbackUrl = Routes.Auth.redirectToDashboard(), forceProConnect } =
      searchParamsSchema.parse(searchParams);

    const h = await headers();

    const utilisateur = await getSessionUser({ headers: h });

    if (utilisateur) {
      redirect(callbackUrl);
    }

    const providers: Partial<Record<AuthProvider, ProviderProps>> = getProviders();

    const lastUsed = getLastUsedProvider({ headers: h });
    if (lastUsed && providers[lastUsed]) {
      providers[lastUsed].isLastUsed = true;
    }

    return (
      <SignInPage
        providers={providers}
        callbackUrl={callbackUrl}
        forceProConnect={forceProConnect}
      />
    );
  });
}

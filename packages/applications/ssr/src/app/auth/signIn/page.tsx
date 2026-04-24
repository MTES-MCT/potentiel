import z from 'zod';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { getLastUsedProvider } from '@/auth/providers/getLastUsedProvider';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { AuthProvider, getProviders } from '@/auth/providers/authProvider';
import { ProviderProps } from '@/components/organisms/auth/AuthTile';
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

    const context = getContext();
    if (context?.utilisateur) {
      redirect(callbackUrl);
    }

    const providers: Partial<Record<AuthProvider, ProviderProps>> = getProviders();

    const lastUsed = getLastUsedProvider({ headers: await headers() });
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

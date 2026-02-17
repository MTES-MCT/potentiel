import z from 'zod';
import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getLastUsedProvider } from '@/auth/getCurrentProvider';
import { AuthProvider, getProviders } from '@/auth/providers/authProvider';
import { ProviderProps } from '@/components/organisms/auth/AuthTile';
import { callbackURLSchema } from '@/utils/zod/auth';

import SignInPage from './SignIn.page';

type PageProps = {
  searchParams: Record<string, string>;
};

const searchParamsSchema = z.object({
  callbackUrl: callbackURLSchema.optional(),
  forceProConnect: z.stringbool().optional(),
});

export default function SignIn({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const { callbackUrl = Routes.Auth.redirectToDashboard(), forceProConnect } =
      searchParamsSchema.parse(searchParams);

    const context = getContext();
    if (context?.utilisateur) {
      redirect(callbackUrl);
    }

    const providers: Partial<Record<AuthProvider, ProviderProps>> = getProviders();

    const lastUsed = getLastUsedProvider();
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

import z from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { callbackURLSchema } from '../../../utils/zod/auth';

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
    const providers = process.env.AUTH_PROVIDERS?.split(',') ?? [];
    const providersKO = process.env.AUTH_PROVIDERS_KO?.split(',') ?? [];

    const context = getContext();

    if (context?.utilisateur) {
      redirect(callbackUrl);
    }

    return (
      <SignInPage
        providers={providers}
        lastUsedLoginMethod={cookies().get('better-auth.last_used_login_method')?.value}
        callbackUrl={callbackUrl}
        forceProConnect={forceProConnect}
        providersKO={providersKO}
      />
    );
  });
}

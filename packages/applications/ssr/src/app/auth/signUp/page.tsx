import z from 'zod';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { Routes } from '@potentiel-applications/routes';

import { AuthProvider, getProviders } from '@/auth/providers/authProvider';
import { ProviderProps } from '@/components/organisms/auth/AuthTile';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { callbackURLSchema } from '@/utils/zod/auth';

import SignUpPage from './SignUp.page';
import { getSessionUser } from '@/auth/getSessionUser';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

const searchParamsSchema = z.object({
  callbackUrl: callbackURLSchema.optional(),
  error: z.string().optional(),
});

export default async function SignUp(props: PageProps) {
  const searchParams = await props.searchParams;
  return PageWithErrorHandling(async () => {
    const { callbackUrl = Routes.Auth.redirectToDashboard(), error } =
      searchParamsSchema.parse(searchParams);

    const utilisateur = await getSessionUser({ headers: await headers() });

    if (utilisateur) {
      redirect(callbackUrl);
    }

    const providers: Partial<Record<AuthProvider, ProviderProps>> = getProviders();

    return <SignUpPage providers={providers} callbackUrl={callbackUrl} error={error} />;
  });
}

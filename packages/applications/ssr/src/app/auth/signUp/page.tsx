import z from 'zod';
import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { AuthProvider, getProviders } from '@/auth/providers/authProvider';
import { ProviderProps } from '@/components/organisms/auth/AuthTile';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { callbackURLSchema } from '@/utils/zod/auth';

import SignUpPage from './SignUp.page';

type PageProps = {
  searchParams: Record<string, string>;
};

const searchParamsSchema = z.object({
  callbackUrl: callbackURLSchema.optional(),
  error: z.string().optional(),
});

export default function SignUp({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const { callbackUrl = Routes.Auth.redirectToDashboard(), error } =
      searchParamsSchema.parse(searchParams);

    const context = getContext();
    if (context?.utilisateur) {
      redirect(callbackUrl);
    }

    const providers: Partial<Record<AuthProvider, ProviderProps>> = getProviders();

    return <SignUpPage providers={providers} callbackUrl={callbackUrl} error={error} />;
  });
}

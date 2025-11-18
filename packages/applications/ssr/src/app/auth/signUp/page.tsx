import z from 'zod';

import { Routes } from '@potentiel-applications/routes';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { callbackURLSchema } from '../../../utils/zod/auth';

import SignUpPage from './SignUp.page';

type PageProps = {
  searchParams: Record<string, string>;
};

const searchParamsSchema = z.object({
  callbackUrl: callbackURLSchema,
  error: z.string().optional(),
});

export default function SignUp({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const { callbackUrl, error } = searchParamsSchema.parse(searchParams);
    const providers = process.env.NEXTAUTH_PROVIDERS?.split(',') ?? [];
    return (
      <SignUpPage
        providers={providers}
        callbackUrl={callbackUrl ?? Routes.Auth.redirectToDashboard()}
        error={error}
      />
    );
  });
}

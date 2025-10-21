import z from 'zod';

import { Routes } from '@potentiel-applications/routes';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import SignInPage from './SignIn.page';

type PageProps = {
  searchParams: Record<string, string>;
};

const searchParamsSchema = z.object({
  callbackUrl: z
    .string()
    .refine((url) => url.startsWith('/') || url.startsWith(process.env.BASE_URL ?? '__MISSING__'))
    .optional(),
  forceProConnect: z.stringbool().optional(),
});

export default function SignIn({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    console.log({ searchParams });
    const { callbackUrl, forceProConnect } = searchParamsSchema.parse(searchParams);
    const providers = process.env.NEXTAUTH_PROVIDERS?.split(',') ?? [];

    return (
      <SignInPage
        providers={providers}
        callbackUrl={callbackUrl ?? Routes.Auth.redirectToDashboard()}
        forceProConnect={forceProConnect}
      />
    );
  });
}

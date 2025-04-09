import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import SignInPage from './SignIn.page';

export default function SignIn() {
  return PageWithErrorHandling(async () => {
    const providers = process.env.NEXTAUTH_PROVIDERS?.split(',') ?? [];
    return <SignInPage providers={providers} />;
  });
}

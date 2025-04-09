import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import SignUpPage from './SignUp.page';

export default function SignUp() {
  return PageWithErrorHandling(async () => {
    const providers = process.env.NEXTAUTH_PROVIDERS?.split(',') ?? [];
    return <SignUpPage providers={providers} />;
  });
}

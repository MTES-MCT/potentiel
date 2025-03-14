import SignInPage from './SignIn.page';

export default function SignIn() {
  const providers = process.env.NEXTAUTH_PROVIDERS?.split(',') ?? [];
  return <SignInPage providers={providers} />;
}

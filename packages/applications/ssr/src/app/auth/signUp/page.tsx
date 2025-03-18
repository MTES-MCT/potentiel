import SignInPage from '../signIn/SignIn.page';

export default function SignUp() {
  const providers = (process.env.NEXTAUTH_PROVIDERS?.split(',') ?? []).filter(
    (provider) => provider !== 'keycloak',
  );
  return <SignInPage providers={providers} />;
}

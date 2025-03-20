import SignUpPage from './SignUp.page';

export default function SignUp() {
  const providers = process.env.NEXTAUTH_PROVIDERS?.split(',') ?? [];
  return <SignUpPage providers={providers} />;
}

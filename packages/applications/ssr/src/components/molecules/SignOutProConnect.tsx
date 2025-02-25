'use client';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Heading1 } from '../atoms/headings';

type SignOutProConnectProps = {
  callbackUrl: string | undefined;
};

export const SignOutProConnect = ({ callbackUrl }: SignOutProConnectProps) => {
  const router = useRouter();
  return (
    <div className={fr.cx('fr-container')}>
      <Heading1>Vous n'êtes pas autorisé à utiliser ProConnect.</Heading1>
      <p className={fr.cx('fr-text--sm', 'fr-mb-3w')}>
        ProConnect est en phase d'expérimentation actuellement. <br />
        Veuillez vous déconnecter et choisir l'authentification par mot de passe.
      </p>
      <ul className={fr.cx('fr-btns-group', 'fr-btns-group--inline-md')}>
        <li>
          <Button onClick={() => signOut().then(() => router.push(callbackUrl ?? '/'))}>
            Me déconnecter
          </Button>
        </li>
      </ul>
    </div>
  );
};

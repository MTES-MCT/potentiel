import Button from '@codegouvfr/react-dsfr/Button';
import Link from 'next/link';

import { PageTemplate } from '@/components/templates/Page.template';

export default async function HomePage() {
  return (
    <PageTemplate>
      <div className="flex flex-col gap-4">
        Vous êtes sur la home page de l'app SSR
        <div>
          <Link href="/candidatures">
            <Button>Voir les projets</Button>
          </Link>
        </div>
      </div>
    </PageTemplate>
  );
}

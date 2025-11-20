import { Tabs } from '@codegouvfr/react-dsfr/Tabs';

import { InformationsGénéralesLauréat } from './InformationsGénéralesLauréat';
import { ContactLauréat } from './ContactLauréat';
import { InstallationLauréat } from './InstallationLauréat';
import { EtatAvancementLauréat } from './EtatAvancement';
import { MatérielEtTechnologieSection } from './MatérielsEtTechnologieSection';

export type LauréatDétailsPageActions = 'imprimer-page' | 'modifier-lauréat';

export const LauréatDétailsPage = () => (
  <>
    <Tabs
      tabs={[
        {
          label: 'Overview',
          iconId: 'ri-dashboard-line',
          isDefault: true,
          content: <EtatAvancementLauréat />,
        },
        {
          label: 'Information Générale',
          iconId: 'ri-focus-line',
          content: <InformationsGénéralesLauréat />,
        },
        {
          label: 'Matériel et technologies',
          iconId: 'ri-building-3-line',
          content: <MatérielEtTechnologieSection />,
        },
        {
          label: 'Contact',
          iconId: 'ri-mail-line',
          content: <ContactLauréat />,
        },
        {
          label: 'Installation',
          iconId: 'ri-home-line',
          content: <InstallationLauréat />,
        },
      ]}
    />
  </>
);

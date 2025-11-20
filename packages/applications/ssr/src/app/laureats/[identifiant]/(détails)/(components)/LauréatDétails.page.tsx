import { Tabs } from '@codegouvfr/react-dsfr/Tabs';

import { InformationsGénéralesSection } from './InformationsGénéralesSection';
import { VueEnsembleSection } from './VueEnsembleSection';
import { MatérielEtTechnologieSection } from './MatérielsEtTechnologieSection';
import { AdministratifSection } from './AdministratifSection';
import { DocumentSection } from './DocumentsSection';
import { InstallationSection } from './InstallationSection';

export type LauréatDétailsPageActions = 'imprimer-page' | 'modifier-lauréat';

export const LauréatDétailsPage = () => (
  <>
    <Tabs
      tabs={[
        {
          label: "Vue d'ensemble",
          iconId: 'ri-dashboard-line',
          isDefault: true,
          content: <VueEnsembleSection />,
        },
        {
          label: 'Administratif',
          iconId: 'ri-focus-line',
          content: <AdministratifSection />,
        },
        {
          label: 'Informations Générales',
          iconId: 'ri-focus-line',
          content: <InformationsGénéralesSection />,
        },
        {
          label: 'Fournisseurs',
          iconId: 'ri-building-3-line',
          content: <MatérielEtTechnologieSection />,
        },
        {
          label: 'Installation',
          iconId: 'ri-home-line',
          content: <InstallationSection />,
        },
        {
          label: 'Documents',
          iconId: 'ri-home-line',
          content: <DocumentSection />,
        },
      ]}
    />
  </>
);

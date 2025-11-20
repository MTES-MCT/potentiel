import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { PageTemplate } from '../../../../components/templates/Page.template';
import { InformationsGénéralesLauréat } from './InformationsGénéralesLauréat';
import { Tabs } from '@codegouvfr/react-dsfr/Tabs';
import { ContactLauréat } from './ContactLauréat';
import { InstallationLauréat } from './InstallationLauréat';
import { EtatAvancementLauréat } from './EtatAvancement';
import { MatérielEtTechnologieSection } from './MatérielsEtTechnologieSection';

export type LauréatDétailsPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  lauréat: { nomProjet: string };
  actions: LauréatDétailsPageActions[];
};

export type LauréatDétailsPageActions = 'imprimer-page' | 'modifier-lauréat';

export const LauréatDétailsPage: React.FC<LauréatDétailsPageProps> = ({
  identifiantProjet,
  lauréat,
  actions,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Tabs
      tabs={[
        {
          label: 'Overview',
          iconId: 'ri-dashboard-line',
          isDefault: true,
          content: (
            <EtatAvancementLauréat
              identifiantProjet={identifiantProjet}
              lauréat={lauréat}
              actions={actions}
            />
          ),
        },
        {
          label: 'Information Générale',
          iconId: 'ri-focus-line',
          content: (
            <InformationsGénéralesLauréat
              identifiantProjet={identifiantProjet}
              lauréat={lauréat}
              actions={actions}
            />
          ),
        },
        {
          label: 'Matériel et technologies',
          iconId: 'ri-building-3-line',
          content: (
            <MatérielEtTechnologieSection
              identifiantProjet={identifiantProjet}
              lauréat={lauréat}
              actions={actions}
            />
          ),
        },
        {
          label: 'Contact',
          iconId: 'ri-mail-line',
          content: (
            <ContactLauréat
              identifiantProjet={identifiantProjet}
              lauréat={lauréat}
              actions={actions}
            />
          ),
        },
        {
          label: 'Installation',
          iconId: 'ri-home-line',
          content: (
            <InstallationLauréat
              identifiantProjet={identifiantProjet}
              lauréat={lauréat}
              actions={actions}
            />
          ),
        },
      ]}
    />{' '}
  </PageTemplate>
);

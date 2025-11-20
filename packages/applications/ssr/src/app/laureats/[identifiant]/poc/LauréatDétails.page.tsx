import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { PageTemplate } from '../../../../components/templates/Page.template';
import { InformationsGénéralesLauréat } from './InformationsGénéralesLauréat';
import { Tabs } from '@codegouvfr/react-dsfr/Tabs';
import { ContactLauréat } from './ContactLauréat';
import { InstallationLauréat } from './InstallationLauréat';
import { EtatAvancementLauréat } from './EtatAvancement';

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
          label: "État d'avancement",
          iconId: 'fr-icon-add-line',
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
          iconId: 'fr-icon-add-line',
          content: (
            <InformationsGénéralesLauréat
              identifiantProjet={identifiantProjet}
              lauréat={lauréat}
              actions={actions}
            />
          ),
        },
        { label: 'Matériel et technologies', content: <p>Content of tab3</p> },
        {
          label: 'Contact',
          iconId: 'fr-icon-ball-pen-fill',
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
          iconId: 'fr-icon-ball-pen-fill',
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

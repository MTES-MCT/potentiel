import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

import { Section } from '../(components)/Section';

// Nom candidat
// Représentant Légal
// Producteur
// les contacts
export const AdministratifSection = () => (
  <ColumnTemplate
    heading={<Heading2>Renseignements Administratifs</Heading2>}
    leftColumn={{
      children: <Administratif />,
    }}
    rightColumn={{
      children: (
        <ButtonsGroup
          buttonsSize="medium"
          buttonsEquisized
          alignment="center"
          inlineLayoutWhen="always"
          className="flex flex-col gap-1"
          buttons={[
            {
              children: 'Gérer les accès au projet',
              iconId: 'fr-icon-mail-line',
              priority: 'primary',
            },
            {
              children: 'Modifier le producteur',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
            {
              children: 'Modifier le représentant légal',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
          ]}
        />
      ),
    }}
  />
);

const Administratif = () => (
  <div className="flex flex-col gap-4">
    <Section title="Représentant du projet">
      <>
        <div className="flex flex-col gap-2">
          <span className="mb-0 font-semibold">Nom candidat</span>
          <span>Michel Berger</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="mb-0 font-semibold">Représentant légal</span>
          <span>Michel Berger #1</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="mb-0 font-semibold">Producteur</span>
          <span>Manoir de Hérouville</span>
        </div>
      </>
    </Section>
    <Section title="Contacts">
      <>
        <div className="flex flex-col gap-2">
          <span className="mb-0 font-semibold">Adresse email de candidature</span>
          <span>berber@gmail.com</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="mb-0 font-semibold">Comptes ayant accès au projet</div>
          <span>berber@gmail.com</span>
          <span>michou@gmail.com</span>
        </div>
      </>
    </Section>
  </div>
);

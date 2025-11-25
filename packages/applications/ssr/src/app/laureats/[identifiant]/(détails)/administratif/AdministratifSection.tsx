import Button from '@codegouvfr/react-dsfr/Button';

import { Heading2 } from '@/components/atoms/headings';

import { Section } from '../(components)/Section';
import { ColumnPageTemplate } from '../../../../../components/templates/ColumnPage.template';

// Nom candidat
// Représentant Légal
// Producteur
// les contacts
export const AdministratifSection = () => (
  <ColumnPageTemplate
    heading={<Heading2>Renseignements Administratifs</Heading2>}
    leftColumn={{
      children: <AdministratifLeft />,
    }}
    rightColumn={{
      children: <AdministratifRight />,
    }}
  />
);

const AdministratifLeft = () => (
  <div className="flex flex-col gap-4">
    <Section title="Représentant légal">
      <span>Michel Berger #1</span>
      <Button priority="tertiary no outline" className="p-0 m-0" size="small">
        Modifier le représentant légal
      </Button>
    </Section>
    <Section title="Producteur">
      <span>Manoir de Hérouville</span>
      <Button priority="tertiary no outline" className="p-0 m-0" size="small">
        Modifier le producteur
      </Button>
    </Section>
  </div>
);

const AdministratifRight = () => (
  <Section title="Contacts">
    <div className="flex flex-col gap-2">
      <span className="mb-0 font-semibold">Nom du candidat</span>
      <span>Michel Berger</span>
    </div>
    <div className="flex flex-col gap-2">
      <span className="mb-0 font-semibold">Adresse email de candidature</span>
      <span>berber@gmail.com</span>
    </div>
    {/* à voir duplica avec Accès */}
    <div className="flex flex-col gap-2">
      <div className="mb-0 font-semibold">Comptes ayant accès au projet</div>
      <span>berber@gmail.com</span>
      <span>michou@gmail.com</span>
    </div>
  </Section>
);

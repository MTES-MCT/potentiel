import Button from '@codegouvfr/react-dsfr/Button';

import { Section } from '../(components)/Section';
import { SectionPage } from '../(components)/SectionPage';

export const InformationsGénéralesPage = () => (
  <SectionPage title="Informations Générales">
    <InformationsGénérales />
  </SectionPage>
);

const InformationsGénérales = () => (
  <>
    <Section title="Candidat">
      <div className="flex flex-col">
        <span className="mb-0 font-semibold">Site de Production</span>
        <span>3 rue du beurre</span>
        <span>69008 LYON</span>
        <span>Région Rhônes Alpes</span>
      </div>
      <div>
        <div className="mb-0 font-semibold">Nom du candidat</div>
        <span>Michel Berger</span>
      </div>
      <div>
        <div className="mb-0 font-semibold">Adresse email de candidature</div>
        <span>berber@gmail.com</span>
      </div>
    </Section>
    <Section title="Actionnariat">
      <>
        <div>
          <div className="mb-0 font-semibold">Actionnaire (société mère)</div>
          <span>Groupe Bolloré</span>
        </div>
        <div>
          <div className="mb-0 font-semibold">Type d'actionnariat</div>
          <span>Financement collectif</span>
        </div>
      </>
    </Section>
    <Section title="Contractualisation">
      <>
        <div className="flex flex-col gap-1">
          <div className="mb-0 font-semibold">Performances</div>
          <span>Puissance installée : 5 MWc</span>
          <Button priority="tertiary no outline" className="p-0 m-0" size="small">
            Modifier la puissance
          </Button>
        </div>
        <div>
          <div className="mb-0 font-semibold">Prix</div>
          <span>78 €/MWh</span>
        </div>
      </>
    </Section>
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
  </>
);

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2, Heading6 } from '@/components/atoms/headings';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { Section } from '../(components)/Section';

import { GetLauréatData } from './_helpers/getInformationsGénéralesData';
import { ProducteurSection } from './(sections)/(producteur)/Producteur.section';
import { ReprésentantLégalSection } from './(sections)/(représentant-légal)/ReprésentantLégal.section';
import { ActionnariatSection } from './(sections)/(actionnariat)/Actionnariat.section';
import { ContractualisationSection } from './(sections)/(contractualisation)/Contractualisation.section';

type OldProps = {
  siteDeProduction: GetLauréatData['siteDeProduction'];
  emailContact: GetLauréatData['emailContact'];
  identifiantProjet: string;
};

type Props = {
  identifiantProjet: string;
};

export const InformationsGénéralesPage = ({
  identifiantProjet,
  siteDeProduction,
  emailContact,
}: OldProps) => (
  <ColumnPageTemplate
    heading={<Heading2>Informations Générales</Heading2>}
    leftColumn={{
      children: (
        <InformationsGénéralesLeft
          siteDeProduction={siteDeProduction}
          emailContact={emailContact}
          identifiantProjet={identifiantProjet}
        />
      ),
    }}
    rightColumn={{
      children: <InformationsGénéralesRight identifiantProjet={identifiantProjet} />,
    }}
  />
);

const InformationsGénéralesLeft = ({
  siteDeProduction,
  emailContact,
  identifiantProjet,
}: OldProps) => (
  <div className="flex flex-col gap-4">
    <Section title="Candidat">
      <div className="flex flex-col gap-1">
        <Heading6>Site de Production</Heading6>
        <span>{siteDeProduction.value.adresse1}</span>
        {siteDeProduction.value.adresse2 && <span>{siteDeProduction.value.adresse2}</span>}
        <span>
          {siteDeProduction.value.codePostal} {siteDeProduction.value.commune}
        </span>
        <span>
          {siteDeProduction.value.département} {siteDeProduction.value.région}
        </span>
        {siteDeProduction.action && (
          <TertiaryLink href={siteDeProduction.action.url}>
            {siteDeProduction.action.label}
          </TertiaryLink>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Heading6>Adresse email de candidature</Heading6>
        <span>{emailContact}</span>
      </div>
    </Section>
    <ReprésentantLégalSection identifiantProjet={identifiantProjet} />
    <ProducteurSection identifiantProjet={identifiantProjet} />
  </div>
);

const InformationsGénéralesRight = ({ identifiantProjet }: Props) => (
  <div className="flex flex-col gap-4">
    <ContractualisationSection identifiantProjet={identifiantProjet} />
    <ActionnariatSection identifiantProjet={identifiantProjet} />
  </div>
);

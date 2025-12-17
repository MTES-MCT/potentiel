import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2, Heading6 } from '@/components/atoms/headings';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { Section } from '../(components)/Section';

import { GetLauréatData, GetPuissanceData } from './_helpers/getInformationsGénéralesData';
import { ProducteurSection } from './(sections)/(producteur)/Producteur.section';
import { ReprésentantLégalSection } from './(sections)/(représentant-légal)/ReprésentantLégal.section';
import { ActionnariatSection } from './(sections)/(actionnariat)/Actionnariat.section';

type Props = {
  puissance: GetPuissanceData;
  siteDeProduction: GetLauréatData['siteDeProduction'];
  emailContact: GetLauréatData['emailContact'];
  prixRéférence: GetLauréatData['prixRéférence'];
  coefficientKChoisi: GetLauréatData['coefficientKChoisi'];
  identifiantProjet: string;
};

export const InformationsGénéralesPage = ({
  siteDeProduction,
  emailContact,
  prixRéférence,
  puissance,
  coefficientKChoisi,
  identifiantProjet,
}: Props) => (
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
      children: (
        <InformationsGénéralesRight
          prixRéférence={prixRéférence}
          puissance={puissance}
          coefficientKChoisi={coefficientKChoisi}
          identifiantProjet={identifiantProjet}
        />
      ),
    }}
  />
);

const InformationsGénéralesLeft = ({
  siteDeProduction,
  emailContact,
  identifiantProjet,
}: Pick<Props, 'siteDeProduction' | 'emailContact' | 'identifiantProjet'>) => (
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

const InformationsGénéralesRight = ({
  prixRéférence,
  puissance,
  coefficientKChoisi,
  identifiantProjet,
}: Pick<Props, 'puissance' | 'prixRéférence' | 'identifiantProjet' | 'coefficientKChoisi'>) => (
  <div className="flex flex-col gap-4">
    <Section title="Contractualisation">
      <div className="flex flex-col gap-1">
        <Heading6>Performances</Heading6>
        <span>
          Puissance installée : {puissance.value.puissance} {puissance.value.unitéPuissance}
        </span>
        {puissance.value.puissanceDeSite !== undefined && (
          <span>
            Puissance sur site : {puissance.value.puissanceDeSite} {puissance.value.unitéPuissance}
          </span>
        )}
        {puissance.action && (
          <TertiaryLink href={puissance.action.url}>{puissance.action.label}</TertiaryLink>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Heading6>Prix</Heading6>
        <span>{prixRéférence} €/MWh</span>
      </div>
    </Section>
    <ActionnariatSection identifiantProjet={identifiantProjet} />
    {coefficientKChoisi !== undefined && (
      <Section title="Coefficient K">
        <span>{coefficientKChoisi ? 'Oui' : 'Non'}</span>
      </Section>
    )}
  </div>
);

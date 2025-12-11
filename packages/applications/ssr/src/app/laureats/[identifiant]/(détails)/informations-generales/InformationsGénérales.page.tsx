import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2, Heading6 } from '@/components/atoms/headings';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { Section } from '../(components)/Section';
import { getActionnariatTypeLabel } from '../../../../_helpers';

import {
  GetActionnaireData,
  GetLauréatData,
  GetProducteurData,
  GetPuissanceData,
  GetReprésentantLégalData,
} from './_helpers/getInformationsGénéralesData';

type Props = {
  représentantLégal: GetReprésentantLégalData;
  producteur: GetProducteurData;
  actionnaire: GetActionnaireData;
  puissance: GetPuissanceData;
  siteDeProduction: GetLauréatData['siteDeProduction'];
  emailContact: GetLauréatData['emailContact'];
  prixRéférence: GetLauréatData['prixRéférence'];
  actionnariat: GetLauréatData['actionnariat'];
  coefficientKChoisi: GetLauréatData['coefficientKChoisi'];
};

export const InformationsGénéralesPage = ({
  représentantLégal,
  producteur,
  actionnaire,
  siteDeProduction,
  emailContact,
  prixRéférence,
  actionnariat,
  puissance,
  coefficientKChoisi,
}: Props) => (
  <ColumnPageTemplate
    heading={<Heading2>Informations Générales</Heading2>}
    leftColumn={{
      children: (
        <InformationsGénéralesLeft
          siteDeProduction={siteDeProduction}
          emailContact={emailContact}
          représentantLégal={représentantLégal}
          producteur={producteur}
        />
      ),
    }}
    rightColumn={{
      children: (
        <InformationsGénéralesRight
          actionnaire={actionnaire}
          prixRéférence={prixRéférence}
          actionnariat={actionnariat}
          puissance={puissance}
          coefficientKChoisi={coefficientKChoisi}
        />
      ),
    }}
  />
);

const InformationsGénéralesLeft = ({
  siteDeProduction,
  emailContact,
  représentantLégal,
  producteur,
}: Pick<Props, 'siteDeProduction' | 'emailContact' | 'producteur' | 'représentantLégal'>) => (
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
    <Section title="Représentant légal">
      <div className="flex flex-col gap-1">
        <span>{représentantLégal.value.nom || 'Champ non renseigné'}</span>
        {représentantLégal.action && (
          <TertiaryLink href={représentantLégal.action.url}>
            {représentantLégal.action.label}
          </TertiaryLink>
        )}
      </div>
    </Section>
    <Section title="Producteur">
      <div className="flex flex-col gap-1">
        <span>{producteur.value.producteur || 'Champ non renseigné'}</span>
        {producteur.action && (
          <TertiaryLink href={producteur.action.url}>{producteur.action.label}</TertiaryLink>
        )}
      </div>
    </Section>
  </div>
);

const InformationsGénéralesRight = ({
  actionnaire,
  prixRéférence,
  actionnariat,
  puissance,
  coefficientKChoisi,
}: Pick<
  Props,
  'puissance' | 'actionnariat' | 'prixRéférence' | 'actionnaire' | 'coefficientKChoisi'
>) => (
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
    <Section title="Actionnariat">
      <div className="flex flex-col gap-1">
        <Heading6>Actionnaire (société mère)</Heading6>
        <span>{actionnaire.value.nom || 'Champ non renseigné'}</span>
        {actionnaire.action && (
          <TertiaryLink href={actionnaire.action.url}>{actionnaire.action.label}</TertiaryLink>
        )}
      </div>
      {actionnariat && (
        <div className="flex flex-col gap-1">
          <Heading6>Type d'actionnariat</Heading6>
          <span>{getActionnariatTypeLabel(actionnariat.type)}</span>
        </div>
      )}
    </Section>
    {coefficientKChoisi !== undefined && (
      <Section title="Coefficient K">
        <span>{coefficientKChoisi ? 'Oui' : 'Non'}</span>
      </Section>
    )}
  </div>
);

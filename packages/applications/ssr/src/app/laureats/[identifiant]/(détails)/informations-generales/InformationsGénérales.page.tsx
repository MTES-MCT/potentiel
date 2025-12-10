import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2 } from '@/components/atoms/headings';
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
      {siteDeProduction.value && (
        <div className="flex flex-col">
          <span className="mb-0 font-semibold">Site de Production</span>
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
      )}
      <div>
        <div className="mb-0 font-semibold">Adresse email de candidature</div>
        <span>{emailContact}</span>
      </div>
    </Section>
    {représentantLégal.value && (
      <Section title="Représentant légal">
        <span>{représentantLégal.value.nom}</span>
        {représentantLégal.action && (
          <TertiaryLink href={représentantLégal.action.url}>
            {représentantLégal.action.label}
          </TertiaryLink>
        )}
      </Section>
    )}
    {producteur.value && (
      <Section title="Producteur">
        <span>{producteur.value.producteur}</span>
        {producteur.action && (
          <TertiaryLink href={producteur.action.url}>{producteur.action.label}</TertiaryLink>
        )}
      </Section>
    )}
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
        <div className="mb-0 font-semibold">Performances</div>
        {puissance.value ? (
          <>
            <span>
              Puissance installée : {puissance.value?.puissance} {puissance.value?.unitéPuissance}
            </span>
            {puissance.value?.puissanceDeSite && (
              <span>
                Puissance sur site : {puissance.value.puissanceDeSite}{' '}
                {puissance.value.unitéPuissance}
              </span>
            )}
          </>
        ) : (
          <span>Champs non renseigné</span>
        )}
        {puissance.action && (
          <TertiaryLink href={puissance.action.url}>{puissance.action.label}</TertiaryLink>
        )}
      </div>
      <div>
        <div className="mb-0 font-semibold">Prix</div>
        <span>{prixRéférence} €/MWh</span>
      </div>
    </Section>
    <Section title="Actionnariat">
      <div>
        <div className="mb-0 font-semibold">Actionnaire (société mère)</div>
        <span>
          {actionnaire.value && actionnaire.value.nom !== ''
            ? actionnaire.value.nom
            : 'Champs non renseigné'}
        </span>
        {actionnaire.action && (
          <TertiaryLink href={actionnaire.action.url}>{actionnaire.action.label}</TertiaryLink>
        )}
      </div>
      {actionnariat && (
        <div>
          <div className="mb-0 font-semibold">Type d'actionnariat</div>
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

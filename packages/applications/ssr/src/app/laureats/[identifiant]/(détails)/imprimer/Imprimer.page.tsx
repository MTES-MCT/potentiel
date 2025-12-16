import { DateTime } from '@potentiel-domain/common';

import { Section } from '../(components)/Section';
import { FormattedDate } from '../../../../../components/atoms/FormattedDate';
import { ÉvaluationCarbonePage } from '../evaluation-carbone/ÉvaluationCarbone.page';
import { GetÉvaluationCarboneForProjectPage } from '../evaluation-carbone/_helpers/getEvaluationCarboneData';
import {
  GetReprésentantLégalData,
  GetProducteurData,
  GetActionnaireData,
  GetPuissanceData,
  GetLauréatData,
} from '../informations-generales/_helpers/getInformationsGénéralesData';
import { InformationsGénéralesPage } from '../informations-generales/InformationsGénérales.page';
import { AutorisationUrbanismeSection } from '../installation/(autorisation-d-urbanisme)/AutorisationUrbanisme.section';
import { InstallationSection } from '../installation/(installation)/Installation.section';
import { NatureDeLExploitationSection } from '../installation/(nature-de-l-exploitation)/NatureDeLExploitation.section';
import { Heading2 } from '../../../../../components/atoms/headings';
import { TableauDeBordPage } from '../TableauDeBord.page';
import { ImprimerButton } from './(component)/ImprimerButton';

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
  évaluationCarbone: GetÉvaluationCarboneForProjectPage;
  identifiantProjet: string;
};

export const ImprimerPage = ({
  représentantLégal,
  producteur,
  actionnaire,
  siteDeProduction,
  emailContact,
  prixRéférence,
  actionnariat,
  puissance,
  coefficientKChoisi,
  évaluationCarbone,
  identifiantProjet,
}: Props) => (
  <>
    <ImprimerButton />
    <Section title="Pour votre information" className="mb-4">
      <div>
        Ce document a été édité le <FormattedDate date={DateTime.now().formatter()} />
        . <br />
        Les informations affichées sur cette page reflètent la situation du projet en fonction des
        éléments fournis à Potentiel à date. Elles sont susceptibles de modifications ultérieures.
      </div>
    </Section>
    <div className="flex flex-col gap-4">
      <TableauDeBordPage identifiantProjet={identifiantProjet} />
      <InformationsGénéralesPage
        siteDeProduction={siteDeProduction}
        emailContact={emailContact}
        représentantLégal={représentantLégal}
        producteur={producteur}
        actionnaire={actionnaire}
        prixRéférence={prixRéférence}
        actionnariat={actionnariat}
        puissance={puissance}
        coefficientKChoisi={coefficientKChoisi}
      />
      <div>
        <Heading2>Informations Générales</Heading2>
        <InstallationSection identifiantProjet={identifiantProjet} />;
        <AutorisationUrbanismeSection identifiantProjet={identifiantProjet} />
        <NatureDeLExploitationSection identifiantProjet={identifiantProjet} />
      </div>
      <ÉvaluationCarbonePage évaluationCarbone={évaluationCarbone} />
    </div>
  </>
);

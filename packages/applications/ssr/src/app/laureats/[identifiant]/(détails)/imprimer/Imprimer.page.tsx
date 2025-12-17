import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Section } from '../(components)/Section';
import { FormattedDate } from '../../../../../components/atoms/FormattedDate';
import { ÉvaluationCarbonePage } from '../evaluation-carbone/ÉvaluationCarbone.page';
import { GetÉvaluationCarboneForProjectPage } from '../evaluation-carbone/_helpers/getEvaluationCarboneData';
import {
  GetPuissanceData,
  GetLauréatData,
} from '../informations-generales/_helpers/getInformationsGénéralesData';
import { InformationsGénéralesPage } from '../informations-generales/InformationsGénérales.page';
import { AutorisationUrbanismeSection } from '../installation/(sections)/(autorisation-d-urbanisme)/AutorisationUrbanisme.section';
import { InstallationSection } from '../installation/(sections)/(installation)/Installation.section';
import { NatureDeLExploitationSection } from '../installation/(sections)/(nature-de-l-exploitation)/NatureDeLExploitation.section';
import { Heading2 } from '../../../../../components/atoms/headings';
import { TableauDeBordPage } from '../TableauDeBord.page';

import { ImprimerButton } from './(component)/ImprimerButton';

type Props = {
  puissance: GetPuissanceData;
  siteDeProduction: GetLauréatData['siteDeProduction'];
  emailContact: GetLauréatData['emailContact'];
  prixRéférence: GetLauréatData['prixRéférence'];
  coefficientKChoisi: GetLauréatData['coefficientKChoisi'];
  évaluationCarbone: GetÉvaluationCarboneForProjectPage;
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ImprimerPage = ({
  siteDeProduction,
  emailContact,
  prixRéférence,
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
        prixRéférence={prixRéférence}
        puissance={puissance}
        coefficientKChoisi={coefficientKChoisi}
        identifiantProjet={identifiantProjet}
      />
      <div>
        <Heading2>Installation</Heading2>
        <div className="flex flex-col gap-4">
          <InstallationSection identifiantProjet={identifiantProjet} />
          <AutorisationUrbanismeSection identifiantProjet={identifiantProjet} />
          <NatureDeLExploitationSection identifiantProjet={identifiantProjet} />
        </div>
      </div>
      <ÉvaluationCarbonePage évaluationCarbone={évaluationCarbone} />
    </div>
  </>
);

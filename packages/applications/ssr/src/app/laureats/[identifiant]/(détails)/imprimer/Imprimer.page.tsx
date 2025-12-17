import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Section } from '../(components)/Section';
import { FormattedDate } from '../../../../../components/atoms/FormattedDate';
import { ÉvaluationCarbonePage } from '../evaluation-carbone/ÉvaluationCarbone.page';
import { GetÉvaluationCarboneForProjectPage } from '../evaluation-carbone/_helpers/getEvaluationCarboneData';
import { InformationsGénéralesPage } from '../informations-generales/InformationsGénérales.page';
import { TableauDeBordPage } from '../TableauDeBord.page';

import { ImprimerButton } from './(component)/ImprimerButton';
import { InstallationPage } from '../installation/Installation.page';

type Props = {
  évaluationCarbone: GetÉvaluationCarboneForProjectPage;
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ImprimerPage = ({ évaluationCarbone, identifiantProjet }: Props) => (
  <>
    {/* <ImprimerButton /> */}
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
      <InformationsGénéralesPage identifiantProjet={identifiantProjet} />
      <InstallationPage identifiantProjet={identifiantProjet} />
      <ÉvaluationCarbonePage évaluationCarbone={évaluationCarbone} />
    </div>
  </>
);

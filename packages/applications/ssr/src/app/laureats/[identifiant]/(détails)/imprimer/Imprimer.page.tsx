import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

import { Section } from '../(components)/Section';
import { ÉvaluationCarbonePage } from '../evaluation-carbone/ÉvaluationCarbone.page';
import { InformationsGénéralesPage } from '../informations-generales/InformationsGénérales.page';
import { InstallationPage } from '../installation/Installation.page';
import { TableauDeBordPage } from '../TableauDeBord.page';

import { ImprimerButton } from './(component)/ImprimerButton';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ImprimerPage = ({ identifiantProjet }: Props) => (
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
      <InformationsGénéralesPage identifiantProjet={identifiantProjet} />
      <InstallationPage identifiantProjet={identifiantProjet} />
      <ÉvaluationCarbonePage identifiantProjet={identifiantProjet} />
    </div>
  </>
);

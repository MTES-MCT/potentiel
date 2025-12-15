'use client';

import { useEffect } from 'react';

import { DateTime } from '@potentiel-domain/common';

import { Section } from '../(components)/Section';
import { FormattedDate } from '../../../../../components/atoms/FormattedDate';
import { ÉvaluationCarbonePage } from '../evaluation-carbone/ÉvaluationCarbone.page';
import { InstallationPage } from '../installation/Installation.page';
import { GetÉvaluationCarboneForProjectPage } from '../evaluation-carbone/_helpers/getEvaluationCarboneData';
import { GetInstallationForProjectPage } from '../installation/_helpers/getInstallation';
import {
  GetReprésentantLégalData,
  GetProducteurData,
  GetActionnaireData,
  GetPuissanceData,
  GetLauréatData,
} from '../informations-generales/_helpers/getInformationsGénéralesData';
import { InformationsGénéralesPage } from '../informations-generales/InformationsGénérales.page';

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
  installation: GetInstallationForProjectPage;
  évaluationCarbone: GetÉvaluationCarboneForProjectPage;
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
  installation,
  évaluationCarbone,
}: Props) => {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <>
      <Section title="Pour votre information" className="mb-4">
        <div>
          Ce document a été édité le <FormattedDate date={DateTime.now().formatter()} />
          . <br />
          Les informations affichées sur cette page reflètent la situation du projet en fonction des
          éléments fournis à Potentiel à date. Elles sont susceptibles de modifications ultérieures.
        </div>
      </Section>
      <div className="flex flex-col gap-4">
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
        <InstallationPage installation={installation} />
        <ÉvaluationCarbonePage évaluationCarbone={évaluationCarbone} />
      </div>
    </>
  );
};

/* eslint-disable react/jsx-props-no-spreading */
'use client';

import { Notice } from '@codegouvfr/react-dsfr/Notice';

import { SectionPage } from './(components)/SectionPage';
import { EtapesProjet, EtapesProjetProps } from './(components)/EtapesProjetSection';
import { GetRaccordementForProjectPage } from './_helpers/getRaccordementData';
import {
  CahierDesChargesSection,
  CahierDesChargesSectionProps,
} from './(components)/CahierDesChargesSection';
import { AbandonAlertData } from './_helpers/getAbandonAlert';
import { AchèvementAlertData } from './_helpers/getAchèvementAlert';
import { GetGarantiesFinancièresData } from './_helpers/getGarantiesFinancièresData';
import { GarantiesFinancièresSection } from './(components)/GarantiesFinancièresSection';
import { RaccordementSection } from './(components)/RaccordementSection';
import { AchèvementSection } from './(components)/AchèvementSection';
import { GetAchèvementData } from './_helpers/getAchèvementData';

type TableauDeBordPageProps = {
  identifiantProjet: string;
  frise: {
    étapes: EtapesProjetProps['étapes'];
    doitAfficherAttestationDésignation: boolean;
  };
  cahierDesCharges: CahierDesChargesSectionProps;
  raccordement: GetRaccordementForProjectPage;
  abandonAlert: AbandonAlertData;
  achèvementAlert: AchèvementAlertData;
  garantiesFinancièresData: GetGarantiesFinancièresData | undefined;
  achèvementData: GetAchèvementData;
};

export const TableauDeBordPage = ({
  identifiantProjet,
  frise: { étapes, doitAfficherAttestationDésignation },
  cahierDesCharges,
  raccordement,
  abandonAlert,
  achèvementAlert,
  garantiesFinancièresData,
  achèvementData,
}: TableauDeBordPageProps) => (
  <SectionPage title="Tableau de bord">
    <div className="flex flex-col gap-4">
      {achèvementAlert && (
        <Notice
          description={achèvementAlert.label}
          title="Modification du projet"
          severity="info"
        />
      )}
      {abandonAlert && (
        <Notice
          description={abandonAlert.label}
          title="Abandon"
          severity="info"
          {...(abandonAlert.url && {
            link: {
              linkProps: {
                href: abandonAlert.url,
              },
              text: 'Voir la page de la demande',
            },
          })}
        />
      )}
      <CahierDesChargesSection value={cahierDesCharges.value} action={cahierDesCharges.action} />
      <div className="flex flex-row gap-4">
        <EtapesProjet
          identifiantProjet={identifiantProjet}
          étapes={étapes}
          doitAfficherAttestationDésignation={doitAfficherAttestationDésignation}
        />
        <div className="flex flex-col gap-4">
          <AchèvementSection achèvement={achèvementData} />
          {raccordement.value && <RaccordementSection raccordement={raccordement} />}
          {garantiesFinancièresData && (
            <GarantiesFinancièresSection
              estAchevé={achèvementData.value.estAchevé}
              identifiantProjet={identifiantProjet}
              garantiesFinancières={garantiesFinancièresData}
            />
          )}
        </div>
      </div>
    </div>
  </SectionPage>
);

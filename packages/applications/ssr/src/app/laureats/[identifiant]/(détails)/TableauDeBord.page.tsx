/* eslint-disable react/jsx-props-no-spreading */
import { Notice } from '@codegouvfr/react-dsfr/Notice';

import { SectionPage } from './(components)/SectionPage';
import { EtapesProjet, EtapesProjetProps } from './(components)/EtapesProjetSection';
import { GetRaccordementForProjectPage } from './_helpers/getRaccordementData';
import { AbandonAlertData } from './_helpers/getAbandonAlert';
import { AchèvementAlertData } from './_helpers/getAchèvementAlert';
import { GetGarantiesFinancièresData } from './_helpers/getGarantiesFinancièresData';
import { GarantiesFinancièresSection } from './(components)/GarantiesFinancièresSection';
import { RaccordementSection } from './(components)/RaccordementSection';
import { AchèvementSection } from './(components)/AchèvementSection';
import { GetAchèvementData } from './_helpers/getAchèvementData';
import { RaccordementAlertesData } from './_helpers/getRaccordementAlert';
import { CahierDesChargesSection } from './(sections)/(cahier-des-charges)/CahierDesCharges.section';
import { Section } from './(components)/Section';

type TableauDeBordPageProps = {
  identifiantProjet: string;
  frise: {
    étapes: EtapesProjetProps['étapes'];
    doitAfficherAttestationDésignation: boolean;
  };
  raccordement: GetRaccordementForProjectPage;
  garantiesFinancièresData: GetGarantiesFinancièresData | undefined;
  achèvementData: GetAchèvementData;
  abandonAlert: AbandonAlertData;
  achèvementAlert: AchèvementAlertData;
  raccordementAlerts: RaccordementAlertesData;
};

export const TableauDeBordPage = ({
  identifiantProjet,
  frise: { étapes, doitAfficherAttestationDésignation },
  raccordement,
  abandonAlert,
  achèvementAlert,
  garantiesFinancièresData,
  achèvementData,
  raccordementAlerts,
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
      <Section title="Cahier des charges">
        <CahierDesChargesSection identifiantProjet={identifiantProjet} />
      </Section>
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <EtapesProjet
            identifiantProjet={identifiantProjet}
            étapes={étapes}
            doitAfficherAttestationDésignation={doitAfficherAttestationDésignation}
          />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <AchèvementSection achèvement={achèvementData} />
          {raccordement.value && (
            <RaccordementSection
              raccordement={raccordement}
              raccordementAlerts={raccordementAlerts}
            />
          )}
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

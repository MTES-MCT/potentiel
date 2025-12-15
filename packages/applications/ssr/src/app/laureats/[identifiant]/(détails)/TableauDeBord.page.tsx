/* eslint-disable react/jsx-props-no-spreading */
import { Notice } from '@codegouvfr/react-dsfr/Notice';

import { SectionPage } from './(components)/SectionPage';
import { EtapesProjet, EtapesProjetProps } from './(components)/EtapesProjetSection';

import { AbandonAlertData } from './_helpers/getAbandonAlert';
import { AchèvementAlertData } from './_helpers/getAchèvementAlert';
import { GetGarantiesFinancièresData } from './_helpers/getGarantiesFinancièresData';
import { GarantiesFinancièresSection } from './(components)/GarantiesFinancièresSection';
import { AchèvementSection } from './(components)/AchèvementSection';
import { GetAchèvementData } from './_helpers/getAchèvementData';
import { CahierDesChargesSection } from './(sections)/(cahier-des-charges)/CahierDesCharges.section';
import { RaccordementSection } from './(sections)/(raccordement)/Raccordement.section';

type TableauDeBordPageProps = {
  identifiantProjet: string;
  frise: {
    étapes: EtapesProjetProps['étapes'];
    doitAfficherAttestationDésignation: boolean;
  };
  garantiesFinancièresData: GetGarantiesFinancièresData | undefined;
  achèvementData: GetAchèvementData;
  abandonAlert: AbandonAlertData;
  achèvementAlert: AchèvementAlertData;
};

export const TableauDeBordPage = ({
  identifiantProjet,
  frise: { étapes, doitAfficherAttestationDésignation },
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
      <CahierDesChargesSection identifiantProjet={identifiantProjet} />
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
          <RaccordementSection identifiantProjet={identifiantProjet} />
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

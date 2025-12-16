/* eslint-disable react/jsx-props-no-spreading */
import { Notice } from '@codegouvfr/react-dsfr/Notice';

import { SectionPage } from './(components)/SectionPage';
import { EtapesProjet, EtapesProjetProps } from './(components)/EtapesProjetSection';

import { AbandonAlertData } from './_helpers/getAbandonAlert';
import { AchèvementAlertData } from './_helpers/getAchèvementAlert';

import { CahierDesChargesSection } from './(sections)/(cahier-des-charges)/CahierDesCharges.section';
import { RaccordementSection } from './(sections)/(raccordement)/Raccordement.section';
import { AchèvementSection } from './(sections)/(achèvement)/Achèvement.section';
import { GarantiesFinancièresSection } from './(sections)/(garanties-financières)/GarantiesFinancières.section';

type TableauDeBordPageProps = {
  identifiantProjet: string;
  frise: {
    étapes: EtapesProjetProps['étapes'];
    doitAfficherAttestationDésignation: boolean;
  };
  abandonAlert: AbandonAlertData;
  achèvementAlert: AchèvementAlertData;
};

export const TableauDeBordPage = ({
  identifiantProjet,
  frise: { étapes, doitAfficherAttestationDésignation },
  abandonAlert,
  achèvementAlert,
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
          <AchèvementSection identifiantProjet={identifiantProjet} />
          <RaccordementSection identifiantProjet={identifiantProjet} />
          <GarantiesFinancièresSection identifiantProjet={identifiantProjet} />
        </div>
      </div>
    </div>
  </SectionPage>
);

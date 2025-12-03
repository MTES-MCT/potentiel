'use client';

import { Notice } from '@codegouvfr/react-dsfr/Notice';
import Link from 'next/link';

import { Section } from './(components)/Section';
import { SectionPage } from './(components)/SectionPage';
import { EtapesProjet, EtapesProjetProps } from './(components)/EtapesProjetSection';
import { GetRaccordementForProjectPage } from './_helpers/getRaccordementData';
import {
  CahierDesChargesSection,
  CahierDesChargesSectionProps,
} from './(components)/CahierDesChargesSection';

type TableauDeBordSectionProps = {
  identifiantProjet: string;
  frise: {
    étapes: EtapesProjetProps['étapes'];
    doitAfficherAttestationDésignation: boolean;
  };
  cahierDesCharges: CahierDesChargesSectionProps;
  raccordement: GetRaccordementForProjectPage;
};

export const TableauDeBordSection = ({
  identifiantProjet,
  frise: { étapes, doitAfficherAttestationDésignation },
  cahierDesCharges,
  raccordement,
}: TableauDeBordSectionProps) => (
  <SectionPage title="Tableau de bord">
    <div className="flex flex-col gap-4">
      <Notice
        description="Vous ne pouvez pas faire de demande ou de déclaration sur Potentiel car vous avez une
            demande d'abandon en cours pour ce projet. Si celle-ci n'est plus d'actualité, merci de
            l'annuler sur la page de la demande ."
        title="Abandon"
        severity="info"
      />
      <CahierDesChargesSection value={cahierDesCharges.value} action={cahierDesCharges.action} />
      <div className="flex flex-row gap-4">
        <EtapesProjet
          identifiantProjet={identifiantProjet}
          étapes={étapes}
          doitAfficherAttestationDésignation={doitAfficherAttestationDésignation}
        />
        <div className="flex flex-col gap-4">
          {raccordement.value && (
            <Section title="Raccordement au réseau">
              {raccordement.value === 'Champs non renseigné' ? (
                raccordement.value
              ) : (
                <>
                  <div>
                    <span className="mb-0 font-semibold">Gestionnaire de réseau</span> :{' '}
                    {raccordement.value.gestionnaireDeRéseau}{' '}
                  </div>
                  <div className="mb-0 font-semibold">
                    {raccordement.value.nombreDeDossiers} dossier(s) de raccordement renseigné(s)
                  </div>
                  {raccordement.action && (
                    <Link className="w-fit" href={raccordement.action.url}>
                      {raccordement.action.label}
                    </Link>
                  )}
                </>
              )}
            </Section>
          )}
          <Section title="Garanties financières">
            <>
              <span>
                Le projet dispose actuellement de garanties financières validées, avec une durée de
                validité jusqu'à six mois après achèvement du projet.
              </span>
            </>
          </Section>
        </div>
      </div>
    </div>
  </SectionPage>
);

'use client';

import { Notice } from '@codegouvfr/react-dsfr/Notice';
import Button from '@codegouvfr/react-dsfr/Button';
import Link from 'next/link';

import { Section } from './(components)/Section';
import { SectionPage } from './(components)/SectionPage';
import { EtapesProjet, EtapesProjetProps } from './(components)/EtapesProjet';
import { GetRaccordementForProjectPage } from './_helpers/getRaccordementData';

type TableauDeBordSectionProps = {
  identifiantProjet: string;
  frise: {
    étapes: EtapesProjetProps['étapes'];
    doitAfficherAttestationDésignation: boolean;
  };
  raccordement: GetRaccordementForProjectPage;
};

export const TableauDeBordSection = ({
  identifiantProjet,
  frise: { étapes, doitAfficherAttestationDésignation },
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
      <Section title="Cahier des charges">
        <span>Instruction selon le cahier des charges en vigueur</span>
        <Button priority="tertiary no outline" className="p-0 m-0" size="small">
          Voir le cahier des charges
        </Button>
        <Notice
          description="Faut changer de cahier des charges wesh."
          title="Cahier des charges"
          severity="info"
          link={{
            linkProps: {
              href: '#',
            },
            text: 'Veuillez en changer ici',
          }}
        />
      </Section>
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

import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { Link } from '@/components/atoms/LinkNoPrefetch';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { PageTemplate } from '@/components/templates/Page.template';
import {
  CorrigerCandidaturesParLotForm,
  type CorrigerCandidaturesParLotFormProps,
} from './CorrigerCandidaturesParLot.form';

export const CorrigerCandidaturesParLotPage: FC<CorrigerCandidaturesParLotFormProps> = ({
  périodes,
}) => (
  <PageTemplate banner={<Heading1>Corriger des candidats par lot</Heading1>}>
    <ColumnPageTemplate
      leftColumn={{
        children: <CorrigerCandidaturesParLotForm périodes={périodes} />,
      }}
      rightColumn={{
        children: (
          <div className="flex flex-col gap-4">
            <Notice
              severity="info"
              title=""
              description={
                <>
                  <span>Aucune notification ne sera envoyée suite à cet import.</span>
                  <br />
                  <span>
                    Il est possible de corriger les données candidature par candidature et de
                    régénérer une attestation post-désignation en consultant{' '}
                    <Link href={Routes.Candidature.lister()} target="_blank">
                      la liste des candidatures
                    </Link>
                    .
                  </span>
                </>
              }
            />
            <Notice
              severity="info"
              title="Si les candidatures que vous modifiez sont notifiées"
              description={
                <span className="flex flex-col">
                  <span>
                    La modification des champs suivants ne mettra pas à jour le projet :
                    <span className="pl-4">
                      <span className="block">• Nom du projet</span>
                      <span className="block">
                        • Localité (adresse, commune, code postal, département, région)
                      </span>
                      <span className="block">• Actionnaire (société mère)</span>
                      <span className="block">• Nom du représentant légal</span>
                      <span className="block">
                        • Puissance (la puissance initiale sera par contre modifiée)
                      </span>
                      <span className="block">• Producteur</span>
                      <span className="block">• Fournisseurs</span>
                      <span className="block">• Évaluation carbone simplifiée</span>
                    </span>
                    Pour les modifier, utilisez le formulaire disponible sur chaque page Projet.
                  </span>
                  <span>
                    <br />
                    Les données suivantes ne pourront pas être modifiées :
                    <span className="pl-4">
                      <span className="block">• Statut</span>
                      <span className="block">• Garanties financières</span>
                    </span>
                  </span>
                </span>
              }
            />
          </div>
        ),
      }}
    />
  </PageTemplate>
);

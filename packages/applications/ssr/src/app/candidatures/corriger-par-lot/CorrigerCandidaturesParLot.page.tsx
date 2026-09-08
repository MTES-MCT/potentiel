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
              title="Correction individuelle"
              description={
                <span>
                  <br />
                  Il est possible de corriger les données candidature par candidature et de
                  régénérer une attestation post-désignation en consultant{' '}
                  <Link href={Routes.Candidature.lister()} target="_blank">
                    la liste des candidatures
                  </Link>
                  .
                </span>
              }
            />
            <Notice
              severity="info"
              title="Si les candidatures que vous modifiez sont notifiées"
              description={
                <span className="flex flex-col gap-2 text-justify">
                  <span>
                    - La modification de ces champs ne mettra pas à jour le projet :
                    <br />• Nom du projet
                    <br />• Localité (adresse, commune, code postal, département, région)
                    <br />• Actionnaire (société mère)
                    <br />• Nom du représentant légal
                    <br />• Puissance (la puissance initiale sera par contre modifiée)
                    <br />• Producteur
                    <br />• Fournisseurs
                    <br />• Évaluation carbone simplifiée
                    <br />
                    Pour les modifier, utilisez le formulaire disponible sur chaque page Projet.
                  </span>
                  <span>
                    - Aussi, les données suivantes ne pourront être modifiées :
                    <br />• Statut
                    <br />• Garanties financières
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

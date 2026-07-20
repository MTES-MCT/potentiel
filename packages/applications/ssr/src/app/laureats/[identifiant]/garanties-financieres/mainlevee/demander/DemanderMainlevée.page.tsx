import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ChecklistMainlevée, type ChecklistMainlevéeProps } from './ChecklistMainlevée';
import { DemanderMainlevéeForm, type DemanderMainlevéeFormProps } from './DemanderMainlevée.form';

export type DemanderMainlevéePageProps = DemanderMainlevéeFormProps & ChecklistMainlevéeProps;
export const DemanderMainlevéePage = ({
  identifiantProjet,
  motif,
  prérequis,
  prérequisComplétés,
}: DemanderMainlevéePageProps) => (
  <ColumnPageTemplate
    heading={<Heading1>Demander la mainlevée des garanties financières</Heading1>}
    leftColumn={{
      children: (
        <>
          <div className="mb-6">
            {prérequisComplétés ? (
              <p>Êtes-vous sûr de vouloir demander la mainlevée des garanties financières ?</p>
            ) : (
              <ChecklistMainlevée identifiantProjet={identifiantProjet} prérequis={prérequis} />
            )}
          </div>

          <DemanderMainlevéeForm
            identifiantProjet={identifiantProjet}
            motif={motif}
            prérequisComplétés={prérequisComplétés}
          />
        </>
      ),
    }}
    rightColumn={{
      children:
        prérequisComplétés && motif === 'projet-achevé' ? (
          <Alert
            severity="info"
            title="Veuillez vérifier l’exactitude des pièces suivantes, déposées sur Potentiel :"
            description={
              <div className="flex flex-col gap-4">
                <ul className="list-disc ml-4 mt-2">
                  <li>L'attestation de conformité,</li>
                  <li>Le rapport associé.</li>
                </ul>
                <p>
                  Ces documents seront vérifiés par les services de l’État en région afin
                  d’instruire votre demande de mainlevée. Vous pouvez, au besoin, vous rendre sur{' '}
                  <Link href={Routes.Achèvement.modifierAttestationConformité(identifiantProjet)}>
                    le formulaire dédié pour les modifier
                  </Link>
                  .
                </p>
              </div>
            }
          />
        ) : null,
    }}
  />
);

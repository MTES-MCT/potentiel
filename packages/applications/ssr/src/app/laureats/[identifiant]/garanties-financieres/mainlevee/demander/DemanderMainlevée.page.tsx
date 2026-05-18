import { Heading1 } from '@/components/atoms/headings';
import { ChecklistMainlevée, type ChecklistMainlevéeProps } from './ChecklistMainlevée';
import { DemanderMainlevéeForm, type DemanderMainlevéeFormProps } from './DemanderMainlevée.form';

export type DemanderMainlevéePageProps = DemanderMainlevéeFormProps & ChecklistMainlevéeProps;
export const DemanderMainlevéePage = ({
  identifiantProjet,
  motif,
  prérequis,
  prérequisComplétés,
}: DemanderMainlevéePageProps) => (
  <>
    <Heading1>Demander la mainlevée des garanties financières</Heading1>
    <div className="my-6">
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
);

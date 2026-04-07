import { Heading1 } from '@/components/atoms/headings';

import { DemanderMainlevéeForm, DemanderMainlevéeFormProps } from './DemanderMainlevée.form';
import { InfoBoxMainlevée, InfoBoxMainlevéeProps } from './InfoBoxMainlevée';

export type DemanderMainlevéePageProps = DemanderMainlevéeFormProps & InfoBoxMainlevéeProps;
export const DemanderMainlevéePage = ({
  identifiantProjet,
  motif,
  prérequis,
  disabled,
}: DemanderMainlevéePageProps) => (
  <>
    <Heading1>Demander la mainlevée des garanties financières</Heading1>
    <div className="my-6">
      <InfoBoxMainlevée identifiantProjet={identifiantProjet} prérequis={prérequis} />
    </div>

    <DemanderMainlevéeForm
      identifiantProjet={identifiantProjet}
      motif={motif}
      disabled={disabled}
    />
  </>
);

import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';

import { demanderMainlevéeAction } from './demanderMainlevée.action';

export type DemanderMainlevéeFormProps = {
  identifiantProjet: string;
  motif: Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
  disabled: boolean;
};

export const DemanderMainlevéeForm = ({
  identifiantProjet,
  motif,
  disabled,
}: DemanderMainlevéeFormProps) => {
  return (
    <Form
      action={demanderMainlevéeAction}
      omitMandatoryFieldsLegend
      actionButtons={{
        submitLabel: 'Demander',
        submitDisabled: disabled,
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <input type={'hidden'} value={motif} name="motif" />
    </Form>
  );
};

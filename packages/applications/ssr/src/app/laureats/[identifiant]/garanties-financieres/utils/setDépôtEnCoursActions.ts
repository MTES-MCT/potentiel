import { DépôtGarantiesFinancières } from '../../../../../components/organisms/garantiesFinancières/types';

type Props = {
  estAdminOuDGEC: boolean;
  estDreal: boolean;
  estPorteur: boolean;
};

export const setDépôtEnCoursActions = ({
  estAdminOuDGEC,
  estDreal,
  estPorteur,
}: Props): DépôtGarantiesFinancières['actions'] => {
  const dépôtEnCoursActions: DépôtGarantiesFinancières['actions'] = [];

  if (estAdminOuDGEC) {
    dépôtEnCoursActions.push('modifier');
  } else if (estDreal) {
    dépôtEnCoursActions.push('instruire', 'modifier');
  } else if (estPorteur) {
    dépôtEnCoursActions.push('modifier', 'supprimer');
  }

  return dépôtEnCoursActions;
};

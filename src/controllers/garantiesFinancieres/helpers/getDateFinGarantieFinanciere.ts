import { Project } from '@entities';
import { add } from 'date-fns';
import { formatDateToString } from '../../../helpers/formatDateToString';

type getDateFinGarantieFinanciereProps = {
  famille: Project['famille'];
  appelOffre: Project['appelOffre'];
  notifiedOn: Project['notifiedOn'];
};

export const getDateFinGarantieFinanciere = ({
  famille,
  appelOffre,
  notifiedOn,
}: getDateFinGarantieFinanciereProps) => {
  if (famille?.soumisAuxGarantiesFinancieres === 'après candidature') {
    return formatDateToString(
      add(notifiedOn, {
        months: famille.garantieFinanciereEnMois,
      }),
    );
  }

  if (appelOffre?.soumisAuxGarantiesFinancieres === 'après candidature') {
    return formatDateToString(
      add(notifiedOn, {
        months: appelOffre.garantieFinanciereEnMois,
      }),
    );
  }

  return '!!!FAMILLE NON DISPONIBLE!!!';
};

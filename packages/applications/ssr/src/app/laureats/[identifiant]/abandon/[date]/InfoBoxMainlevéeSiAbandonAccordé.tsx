import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

type Props = {
  identifiantProjet: string;
};

export const InfoBoxMainlevéeSiAbandonAccordé = ({ identifiantProjet }: Props) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3 flex flex-col">
        <span>
          Votre demande d'abandon ayant été validée, vous pouvez demander la mainlevée de vos
          garanties financières sur Potentiel depuis
          <Link
            href={Routes.GarantiesFinancières.détail(identifiantProjet)}
            className="font-semibold"
          >
            {' '}
            la page des garanties financières du projet
          </Link>
        </span>
        <span>
          Vos garanties financières doivent toutefois être validées et complètes sur Potentiel et ne
          pas faire l'objet de demande de modification ou de renouvellement.
        </span>
      </div>
    }
  />
);

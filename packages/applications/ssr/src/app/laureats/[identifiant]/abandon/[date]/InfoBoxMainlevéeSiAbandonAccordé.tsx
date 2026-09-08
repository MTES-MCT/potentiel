import Notice from '@codegouvfr/react-dsfr/Notice';

import { Routes } from '@potentiel-applications/routes';

import { Link } from '@/components/atoms/LinkNoPrefetch';

type Props = {
  identifiantProjet: string;
};

export const InfoBoxMainlevéeSiAbandonAccordé = ({ identifiantProjet }: Props) => (
  <Notice
    severity="info"
    title="Demande de mainlevée si projet abandonnée"
    description={
      <span>
        <span>
          <br />
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
          <br />
          Vos garanties financières doivent toutefois être validées et complètes sur Potentiel et ne
          pas faire l'objet de demande de modification ou de renouvellement.
        </span>
      </span>
    }
  />
);

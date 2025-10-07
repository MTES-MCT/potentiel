import { Heading3, Link } from '../../../../components';

import { GetDispositifDeStockageForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getDispositifDeStockage';

export type InfoDispositifDeStockageProps = {
  dispositifDeStockage: GetDispositifDeStockageForProjectPage;
};

export const InfoDispositifDeStockage = ({
  dispositifDeStockage,
}: InfoDispositifDeStockageProps) => {
  const {
    installationAvecDispositifDeStockage,
    capacitéDuDispositifDeStockageEnKWh,
    puissanceDuDispositifDeStockageEnKW,
  } = dispositifDeStockage.dispositifDeStockage;

  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Dispositif de stockage</Heading3>
      <span>
        {installationAvecDispositifDeStockage === true
          ? 'Installation couplée à un dispositif de stockage'
          : installationAvecDispositifDeStockage === false
            ? 'Installation sans dispositif de stockage'
            : 'Non renseigné'}
      </span>
      {puissanceDuDispositifDeStockageEnKW ? (
        <span>Puissance du dispositif de stockage : {puissanceDuDispositifDeStockageEnKW} kW</span>
      ) : null}
      {capacitéDuDispositifDeStockageEnKWh ? (
        <span>Capacité du dispositif de stockage : {capacitéDuDispositifDeStockageEnKWh} kWh</span>
      ) : null}
      {dispositifDeStockage.affichage && (
        <Link
          href={dispositifDeStockage.affichage.url}
          aria-label={dispositifDeStockage.affichage.label}
        >
          {dispositifDeStockage.affichage.label}
        </Link>
      )}
    </div>
  );
};

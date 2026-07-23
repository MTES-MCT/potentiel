import Badge from '@codegouvfr/react-dsfr/Badge';
import Notice from '@codegouvfr/react-dsfr/Notice';

import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import type { ChampAvecAction } from '../../_helpers';

export type RaccordementDétailsProps = {
  raccordement: ChampAvecAction<PlainType<Lauréat.Raccordement.ConsulterRaccordementReadModel>>;
  alertes: Array<{ label: string }>;
};

type DossierProps = {
  dossier: PlainType<Lauréat.Raccordement.ConsulterDossierRaccordementReadModel>;
};

const Dossier = ({ dossier }: DossierProps) => {
  const estComplet =
    dossier.demandeComplèteRaccordement?.accuséRéception &&
    dossier.demandeComplèteRaccordement?.dateQualification &&
    ((dossier.propositionTechniqueEtFinancière && dossier.conventionDeRaccordement) ||
      dossier.conventionDeRaccordementDirecte);

  return (
    <div className="flex items-center gap-2">
      {estComplet ? (
        <Badge noIcon small severity="success">
          Complet
        </Badge>
      ) : (
        <Badge noIcon small severity="warning">
          Incomplet
        </Badge>
      )}
      <div>
        Dossier <strong>{dossier.référence.référence}</strong>
      </div>
    </div>
  );
};

export const RaccordementDétails = async ({
  raccordement: { action, value: raccordement },
  alertes,
}: RaccordementDétailsProps) => (
  <>
    {raccordement && (
      <>
        <div>
          <span className="mb-0">Gestionnaire de réseau</span> :{' '}
          {Option.match(raccordement.gestionnaireRéseau)
            .some(({ raisonSociale }) => <strong key={raisonSociale}>{raisonSociale}</strong>)
            .none(() => (
              <span>non renseigné</span>
            ))}
        </div>
        <div className="mb-0">
          {raccordement.dossiers.map((dossier) => (
            <Dossier key={dossier.référence.référence} dossier={dossier} />
          ))}
          {raccordement.dossiers.length === 0 && (
            <span>Aucun dossier de raccordement renseigné</span>
          )}
        </div>
      </>
    )}
    {alertes.map(({ label }) => (
      <Notice
        description={label}
        title="Données de raccordement à compléter"
        severity="info"
        key={label}
        className="print:hidden whitespace-pre-line"
      />
    ))}
    {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
  </>
);

import Notice from '@codegouvfr/react-dsfr/Notice';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ChampObligatoireAvecAction } from '../../_helpers';

export type RaccordementDétailsProps = {
  raccordement: ChampObligatoireAvecAction<
    PlainType<Lauréat.Raccordement.ConsulterRaccordementReadModel>
  >;
  alertes: Array<{ label: string }>;
};

type DossierProps = {
  dossier: PlainType<Lauréat.Raccordement.ConsulterDossierRaccordementReadModel>;
};

const Dossier = ({ dossier }: DossierProps) => {
  const estIncomplet =
    !dossier.demandeComplèteRaccordement?.accuséRéception ||
    !dossier.demandeComplèteRaccordement?.dateQualification ||
    !dossier.propositionTechniqueEtFinancière ||
    !dossier;
  return (
    <div className="flex gap-2">
      <span>
        Dossier <strong>{dossier.référence.référence}</strong>
      </span>
      {estIncomplet && (
        <Badge noIcon small severity="warning">
          Incomplet
        </Badge>
      )}
    </div>
  );
};

export const RaccordementDétails = async ({
  raccordement: { action, value: raccordement },
  alertes,
}: RaccordementDétailsProps) => (
  <>
    <div>
      <span className="mb-0">Gestionnaire de réseau</span> :{' '}
      {Option.match(raccordement.gestionnaireRéseau)
        .some(({ raisonSociale }) => <strong>{raisonSociale}</strong>)
        .none(() => (
          <span>non renseigné</span>
        ))}
    </div>
    <div className="mb-0">
      {raccordement.dossiers.map((dossier) => (
        <Dossier key={dossier.référence.référence} dossier={dossier} />
      ))}
      {raccordement.dossiers.length === 0 && <span>Aucun dossier de raccordement renseigné</span>}
    </div>
    {alertes.map(({ label }, index) => (
      <Notice
        description={label}
        title="Données de raccordement à compléter"
        severity="info"
        key={label + index}
        className="print:hidden whitespace-pre-line"
      />
    ))}
    {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
  </>
);

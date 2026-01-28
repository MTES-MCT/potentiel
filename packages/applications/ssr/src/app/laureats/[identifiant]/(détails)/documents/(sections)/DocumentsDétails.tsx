import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Heading6 } from '@/components/atoms/headings';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';

export type DocumentsDétailsProps = {
  localité: ChampObligatoireAvecAction<PlainType<Lauréat.ConsulterLauréatReadModel['localité']>>;
  emailContact: string;
};

const TéléchargerDocumentButton: FC<{
  identifiantProjet: IdentifiantProjet.RawType;
  identifiantUtilisateur: Email.RawType;
  peutRetirerAccès: boolean;
}> = ({ identifiantProjet, identifiantUtilisateur, peutRetirerAccès }) => {
  return (
    <div>
      <Button
        size="small"
        priority="tertiary no outline"
        onClick={() => setIsOpen(true)}
        disabled={!peutRetirerAccès}
      >
        Télécharger le document
      </Button>
    </div>
  );
};

// date
// type de document
export const DocumentListItem: FC<PorteurListItemProps> = ({
  identifiantProjet,
  identifiantUtilisateur,
  peutÊtreTéléchargé,
}) => {
  return (
    <div className="flex flex-row items-center justify-between border-b-dsfr-border-default-grey-default border-b-2 last:border-none pb-2 pt-1">
      <span className="font-semibold">
        <CopyButton textToCopy={identifiantUtilisateur}>{identifiantUtilisateur}</CopyButton>
      </span>
      <div className="flex flex-row gap-3">
        <TéléchargerDocumentButton
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
          peutRetirerAccès={peutRetirerAccès}
        />
      </div>
    </div>
  );
};

export const DocumentsDétails = ({ localité, emailContact }: DocumentsDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <Heading6>Attestation de désignation</Heading6>
      <span>{localité.value.adresse1}</span>
      {localité.value.adresse2 && <span>{localité.value.adresse2}</span>}
      <span>
        {localité.value.codePostal} {localité.value.commune}
      </span>
      <span>
        {localité.value.département} {localité.value.région}
      </span>
      {localité.action && (
        <TertiaryLink href={localité.action.url}>{localité.action.label}</TertiaryLink>
      )}
    </div>
    <div className="flex flex-col gap-1">
      <Heading6>Adresse email de candidature</Heading6>
      <span>{emailContact}</span>
    </div>
  </>
);

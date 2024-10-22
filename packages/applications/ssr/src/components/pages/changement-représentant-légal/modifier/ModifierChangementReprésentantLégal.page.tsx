import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import {
  ModifierChangementReprésentantLégalForm,
  ModifierChangementReprésentantLégalFormProps,
} from './ModifierChangementReprésentantLégal.form';

export type ModifierChangementReprésentantLégalPageProps =
  ModifierChangementReprésentantLégalFormProps;

export const ModifierChangementReprésentantLégalPage: FC<
  ModifierChangementReprésentantLégalPageProps
> = ({ identifiantProjet, typePersonne, nomRepresentantLegal, pièceJustificative }) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Modifier un changement de représentant légal pour le projet</Heading1>}
      leftColumn={{
        children: (
          <ModifierChangementReprésentantLégalForm
            identifiantProjet={identifiantProjet}
            typePersonne={typePersonne}
            nomRepresentantLegal={nomRepresentantLegal}
            pièceJustificative={pièceJustificative}
          />
        ),
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            description={
              <div className="py-4 text-justify">
                Afin de faire une demande de changement de représentant légal pour votre projet vous
                devez joindre à votre demande des pièces justificative différente selon le type de
                personne.
                <ul className="m-3 list-disc">
                  <li>
                    Si le Candidat est une personne physique, une copie de titre d'identité (carte
                    d'identité ou passeport) en cours de validité
                  </li>
                  <li>
                    Si le Candidat est une société, un extrait Kbis de la société Candidate. Pour
                    les sociétés en cours de constitution, le Candidat transmet une copie des
                    statuts de la société en cours de constitution, une attestation de récépissé de
                    dépôt de fonds pour constitution de capital social et une copie de l'acte
                    désignant le représentant légal de la société
                  </li>
                  <li>
                    Si le Candidat est une collectivité, un extrait de délibération portant sur le
                    projet objet de l'offre
                  </li>
                  <li>
                    Tout document officiel permettant d'attester de l'existence juridique du
                    Candidat
                  </li>
                </ul>
              </div>
            }
          />
        ),
      }}
    />
  );
};

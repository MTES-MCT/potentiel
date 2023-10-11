import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type StatutProjet = 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';

export type CandidatureLegacyReadModel = ReadModel<
  'projet',
  {
    legacyId: string;
    identifiantProjet: RawIdentifiantProjet;
    appelOffre: string;
    période: string;
    famille: string;
    numéroCRE: string;
    statut: StatutProjet;
    nom: string;
    localité: {
      commune: string;
      département: string;
      région: string;
      codePostal: string;
    };
    potentielIdentifier: string;
    nomReprésentantLégal: string;
    nomCandidat: string;
    email: string;
    dateDésignation: string;
    puissance: number;
    cahierDesCharges: string;
  }
>;

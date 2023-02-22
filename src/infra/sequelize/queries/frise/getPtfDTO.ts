import { User } from '@entities';
import { PtfDTO, ProjectStatus } from '@modules/frise';
import { userIs } from '@modules/users';
import { makeDocumentUrl } from '../../../../views/components/timeline/helpers/makeDocumentUrl';

type PtfDonnéesPourDTO =
  | {
      ptfDateDeSignature: Date;
      ptfFichier: { filename: string; id: string };
    }
  | {
      ptfDateDeSignature: null;
      ptfFichier: null;
    }
  | null;

export const getPtfDTO = ({
  ptf,
  user,
  projetStatus,
}: {
  ptf: PtfDonnéesPourDTO;
  user: User;
  projetStatus: ProjectStatus;
}): PtfDTO | undefined => {
  if (!ptf || projetStatus !== 'Classé') return;
  if (!userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) return;

  const { ptfDateDeSignature, ptfFichier } = ptf;

  if (ptfFichier) {
    return {
      type: 'proposition-technique-et-financière',
      date: ptfDateDeSignature.getTime(),
      variant: user.role,
      statut: 'envoyée',
      url: makeDocumentUrl(ptfFichier.id, ptfFichier.filename),
    };
  }
  return {
    type: 'proposition-technique-et-financière',
    variant: user.role,
    statut: 'en-attente',
  };
};

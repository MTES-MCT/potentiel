import { Heading2 } from '@/components/atoms/headings';
import { displayDate } from '@/utils/displayDate';
import Download from '@codegouvfr/react-dsfr/Download';
import { FC } from 'react';

type InstructionAbandonProps = {
  identifiantProjet: string;
  confirmation?: {
    demandéLe: string;
    demandéPar: string;
    réponseSignéeDisponible: boolean;
    confirméLe?: string;
    confirméPar?: string;
  };
  accord?: { accordéPar: string; accordéLe: string; réponseSignéeDisponible: boolean };
  rejet?: { rejetéPar: string; rejetéLe: string; réponseSignéeDisponible: boolean };
};

export const InstructionAbandon: FC<InstructionAbandonProps> = ({
  identifiantProjet,
  confirmation,
  accord,
  rejet,
}) => {
  return (
    <div>
      <Heading2 className="mb-2">Instruction</Heading2>
      <div className="flex gap-3 flex-col">
        {' '}
        {confirmation?.demandéLe && (
          <p>
            Confirmation demandée le {displayDate(new Date(confirmation.demandéLe))} par{' '}
            {confirmation.demandéPar}
            {confirmation.réponseSignéeDisponible && (
              <Download
                details=""
                label="Télécharger la demande de confirmation"
                linkProps={{
                  href: `/laureat/${encodeURIComponent(
                    identifiantProjet,
                  )}/abandon/instruction/reponse-signee/demande-confirmation`,
                }}
                className="mb-0 pb-0"
              />
            )}
          </p>
        )}
        {confirmation?.confirméLe && confirmation.confirméPar && (
          <p>
            Demande confirmée le {displayDate(new Date(confirmation.confirméLe))} par{' '}
            {confirmation.confirméPar}
          </p>
        )}
        {accord && (
          <p className="font-bold">
            Demande d'abandon accordée le {displayDate(new Date(accord.accordéLe))} par{' '}
            {accord.accordéPar}
            {accord.réponseSignéeDisponible && (
              <Download
                details=""
                label="Télécharger le courrier de réponse"
                linkProps={{
                  href: `/laureat/${encodeURIComponent(
                    identifiantProjet,
                  )}/abandon/instruction/reponse-signee/accord`,
                }}
                className="mb-0 pb-0"
              />
            )}
          </p>
        )}
        {rejet && (
          <p className="font-bold">
            Demande d'abandon rejetée le {displayDate(new Date(rejet.rejetéLe))} par{' '}
            {rejet.rejetéPar}
            {rejet.réponseSignéeDisponible && (
              <Download
                details=""
                label="Télécharger le courrier de réponse"
                linkProps={{
                  href: `/laureat/${encodeURIComponent(
                    identifiantProjet,
                  )}/abandon/instruction/reponse-signee/rejet`,
                }}
                className="mb-0 pb-0"
              />
            )}
          </p>
        )}
      </div>
    </div>
  );
};

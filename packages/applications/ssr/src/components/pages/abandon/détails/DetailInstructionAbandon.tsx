import { Heading2 } from '@/components/atoms/headings';
import { displayDate } from '@/utils/displayDate';
import { encodeParameter } from '@/utils/encodeParameter';
import Download from '@codegouvfr/react-dsfr/Download';
import { FC } from 'react';

export type DetailInstructionAbandonProps = {
  confirmation?: {
    demandéLe: string;
    demandéPar: string;
    réponseSignée: string;
    confirméLe?: string;
    confirméPar?: string;
  };
  accord?: { accordéPar: string; accordéLe: string; réponseSignée: string };
  rejet?: { rejetéPar: string; rejetéLe: string; réponseSignée: string };
};

export const DetailInstructionAbandon: FC<DetailInstructionAbandonProps> = ({
  confirmation,
  accord,
  rejet,
}) => {
  return (
    <div>
      <Heading2 className="mb-2">Instruction</Heading2>
      <div className="flex gap-3 flex-col">
        {confirmation?.demandéLe && (
          <div>
            Confirmation demandée le {displayDate(new Date(confirmation.demandéLe))} par{' '}
            {confirmation.demandéPar}
            {confirmation.réponseSignée && (
              <Download
                details=""
                label="Télécharger la demande de confirmation"
                linkProps={{
                  href: `/documents/${encodeParameter(confirmation.réponseSignée)}`,
                }}
                className="mb-0 pb-0"
              />
            )}
          </div>
        )}
        {confirmation?.confirméLe && confirmation.confirméPar && (
          <p>
            Demande confirmée le {displayDate(new Date(confirmation.confirméLe))} par{' '}
            {confirmation.confirméPar}
          </p>
        )}
        {accord && (
          <div className="font-bold">
            Demande d'abandon accordée le {displayDate(new Date(accord.accordéLe))} par{' '}
            {accord.accordéPar}
            {accord.réponseSignée && (
              <Download
                details=""
                label="Télécharger le courrier de réponse"
                linkProps={{
                  href: `/documents/${encodeParameter(accord.réponseSignée)}`,
                }}
                className="mb-0 pb-0"
              />
            )}
          </div>
        )}
        {rejet && (
          <div className="font-bold">
            Demande d'abandon rejetée le {displayDate(new Date(rejet.rejetéLe))} par{' '}
            {rejet.rejetéPar}
            {rejet.réponseSignée && (
              <Download
                details=""
                label="Télécharger le courrier de réponse"
                linkProps={{
                  href: `/documents/${encodeParameter(rejet.réponseSignée)}`,
                }}
                className="mb-0 pb-0"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

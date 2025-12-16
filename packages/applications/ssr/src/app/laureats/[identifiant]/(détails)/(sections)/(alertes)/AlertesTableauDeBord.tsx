/* eslint-disable react/jsx-props-no-spreading */

import Notice from '@codegouvfr/react-dsfr/Notice';

export type Alerte = {
  label: string;
  url?: string;
};

type AlertesTableauDeBordProps = {
  achèvement?: Alerte;
  abandon?: Alerte;
};

export const AlertesTableauDeBord = ({ achèvement, abandon }: AlertesTableauDeBordProps) => {
  return (
    <>
      {achèvement && (
        <Notice description={achèvement.label} title="Modification du projet" severity="info" />
      )}
      {abandon && (
        <Notice
          description={abandon.label}
          title="Abandon"
          severity="info"
          {...(abandon.url && {
            link: {
              linkProps: {
                href: abandon.url,
              },
              text: 'Voir la page de la demande',
            },
          })}
        />
      )}
    </>
  );
};

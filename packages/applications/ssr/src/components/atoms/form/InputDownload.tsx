import { FC } from 'react';
import { Download, DownloadProps } from '@codegouvfr/react-dsfr/Download';

export type DownloadDocumentProps = DownloadProps;

/**
 * @description Ce composant est une surcouche du composant Download de react-dsfr pour ajouter l'attribut target blan et que le document se télécharge directement dans un nouvel onglet, sans preview
 * @param props cf https://components.react-dsfr.codegouv.studio/?path=/docs/components-download--default
 */
export const DownloadDocument: FC<DownloadDocumentProps> = ({ linkProps, ...props }) => (
  <Download
    {...props}
    linkProps={{
      ...linkProps,
      'aria-label': `${linkProps['aria-label'] ?? props.label} (dans un nouvel onglet)`,
      target: '_blank',
    }}
  />
);

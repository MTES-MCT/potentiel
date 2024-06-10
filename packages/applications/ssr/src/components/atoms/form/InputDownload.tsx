import { FC } from 'react';
import { Download, DownloadProps } from '@codegouvfr/react-dsfr/Download';

type InputDownloadProps = DownloadProps;

/**
 * @description Ce composant est une surcouche du composant Download de react-dsfr pour ajouter l'attribut download et que le document se télécharge directement, sans preview
 * @param props cf https://components.react-dsfr.codegouv.studio/?path=/docs/components-download--default
 */
export const InputDownload: FC<InputDownloadProps> = (props) => (
  <Download
    {...{
      ...props,
      linkProps: {
        href: props.linkProps.href,
        download: true,
      },
    }}
  />
);

import React from 'react';

type MetabaseStatsProps = {
  iframeUrl: string;
};

export const MetabaseStats: React.FC<MetabaseStatsProps> = ({ iframeUrl }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (!iframeRef.current) return;
    const onLoad = function () {
      (window as any).iFrameResize({}, this);
    };
    iframeRef.current.addEventListener('load', onLoad);
    return () => {
      iframeRef.current?.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <div>
      <iframe ref={iframeRef} src={iframeUrl} width="100%" frameBorder="0" />
    </div>
  );
};

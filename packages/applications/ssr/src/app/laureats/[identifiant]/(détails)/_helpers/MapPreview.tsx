type MapPreviewProps = {
  latitude: number;
  longitude: number;
};

export const MapPreview = ({ latitude, longitude }: MapPreviewProps) => {
  const delta = 0.05;

  const bbox = [longitude - delta, latitude - delta, longitude + delta, latitude + delta].join(
    '%2C',
  );

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className="mt-2 h-48 w-full overflow-hidden rounded-lg">
      <iframe
        title="Carte de localisation"
        src={src}
        className="h-full w-full border-0"
        loading="lazy"
      />
    </div>
  );
};

export type PaginationUrls = {
  pagePrécédenteUrl?: string;
  pageActuelleUrl: string;
  pageSuivanteUrl?: string;
};

export const buildPaginationUrls = ({
  url,
  pageCount,
}: {
  url: URL;
  pageCount: number;
}): PaginationUrls => {
  const { origin, pathname, href: pageActuelleUrl, searchParams } = url;

  if (!searchParams.has('page')) {
    return {
      pagePrécédenteUrl: undefined,
      pageActuelleUrl,
      pageSuivanteUrl: undefined,
    };
  }

  const pageActuelle = Number(searchParams.get('page'));

  searchParams.set('page', (pageActuelle - 1).toString());
  const pagePrécédenteUrl =
    pageActuelle > 0 ? `${origin}${pathname}?${searchParams.toString()}` : undefined;

  searchParams.set('page', (pageActuelle + 1).toString());
  const pageSuivanteUrl =
    pageActuelle < pageCount - 1 ? `${origin}${pathname}?${searchParams.toString()}` : undefined;

  return {
    pagePrécédenteUrl,
    pageActuelleUrl,
    pageSuivanteUrl,
  };
};

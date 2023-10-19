export const getPagination = (
  request: Request,
): {
  page: number;
  itemsPerPage: number;
} => {
  const { searchParams } = new URL(request.url);
  const page = +(searchParams.get('page') || '');
  const itemsPerPage = +(searchParams.get('itemsPerPage') || '');

  return {
    page,
    itemsPerPage,
  };
};

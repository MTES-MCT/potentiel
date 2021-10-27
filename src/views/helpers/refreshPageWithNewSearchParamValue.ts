export const refreshPageWithNewSearchParamValue = (key: string, value: string): void => {
  const { search, origin, pathname } = window.location

  const searchParams = new URLSearchParams(search)
  searchParams.set(key, value)

  window.location.replace(`${origin}${pathname}?${searchParams.toString()}`)
}

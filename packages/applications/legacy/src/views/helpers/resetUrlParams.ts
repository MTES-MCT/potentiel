/**
 * @deprecated this method is temporary and will be replace soon when we will use a SPA which use a react router
 */
export const resetUrlParams = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault();
  window.location.replace(window.location.origin + window.location.pathname);
};

export const removeSearchParams = (): string => {
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  url.search = "";

  return url.pathname;
};

/**
 * A custom domain needs '/', while a project site needs '/repository/'.
 * configure-pages supplies the correct path; './' keeps local builds portable.
 */
export function normalizeBasePath(value) {
  if (!value || value === './') return './';
  if (value === '/') return '/';
  if (!/^\/?[A-Za-z0-9._~!$&'()+,;=@%/-]+\/?$/.test(value)) {
    throw new Error('PAGES_BASE_PATH must be a URL path, not a full URL.');
  }
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

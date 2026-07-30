const APP_NAME = "Sahayak";
const APP_DESCRIPTION =
  "Find trusted mentors, request guidance, and build long-term support.";

export const siteMetadata = {
  name: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export function createPageMetadata({
  title,
  description = APP_DESCRIPTION,
} = {}) {
  return {
    title: title ? `${title} | ${APP_NAME}` : APP_NAME,
    description,
  };
}

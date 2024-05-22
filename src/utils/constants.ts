export const ARTICLES_BY_PAGE = 6;

const PRODUCTION_DOMAIN = 'https://cloud-hosting-three.vercel.app';
const DEVELOPMENT_DOMAIN = 'http://localhost:3000';

export const DOMAIN =
  process.env.NODE_ENV === 'production'
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;

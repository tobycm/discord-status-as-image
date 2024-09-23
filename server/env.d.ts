interface ImportMetaEnv {
  CORS_ORIGIN?: string;
  FRONTEND_URL?: string;
  REFINER_API_URL?: string;

  PROD?: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

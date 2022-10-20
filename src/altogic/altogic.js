import { createClient } from "altogic";

const envUrl = import.meta.env.VITE_ALTOGIC_ENV_URL;
const clientKey = import.meta.env.VITE_ALTOGIC_CLIENT_KEY;

const altogic = createClient(envUrl, clientKey);

export default altogic;

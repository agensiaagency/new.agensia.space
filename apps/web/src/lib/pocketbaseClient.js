import Pocketbase from 'pocketbase';

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || '/pb';

const pocketbaseClient = new Pocketbase(POCKETBASE_URL);

export default pocketbaseClient;

export { pocketbaseClient };

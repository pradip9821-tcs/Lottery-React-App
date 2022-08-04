import web3 from "./web3";
import config from "./config.json"

const address   = config[".env"].address;
const ABI       = config[".env"].ABI;

export default new web3.eth.Contract(ABI, address);
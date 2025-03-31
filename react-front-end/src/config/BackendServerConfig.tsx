const backServerEndpoint = import.meta.env.PROD ? "" : "http://localhost:5175";
const imageRoot = import.meta.env.PROD ? "/" : "http://localhost:5175/";

export { backServerEndpoint, imageRoot };
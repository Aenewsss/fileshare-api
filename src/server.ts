import app from "./app";
import { environments } from "./environments";

console.log(environments, 'envs')
const PORT = environments.PORT || 3022

app.listen()
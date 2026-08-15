import { execSync } from "node:child_process";

const gitHash = () => execSync("git rev-parse --short HEAD").toString().trim();

export default gitHash;

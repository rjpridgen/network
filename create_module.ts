import { file, pathToFileURL } from "bun"

interface GithubMeta {
    web: string[]
    git: string[]
    pages: string[]
    codespaces: string[]
    copilot: string[]
}

const keys = ["web", "git", "pages", "codespaces", "copilot"]

const github = file(pathToFileURL("./github.json"))

const githubMeta = await github.json() as GithubMeta

const rules = Object.entries(githubMeta).filter(([ key ]) => keys.includes(key)).map(([clave, ips]) => "AND,((OR,(".concat(ips.map((ip) => `IP-${ip.includes("::") ? "CIDR6" : "CIDR"},${ip}`).map((ips) => `(${ips})`).join(', ').concat("))),DIRECT"))).join(", ")

console.log(rules)
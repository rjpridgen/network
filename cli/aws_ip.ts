import consola from "consola";
import { aws, date } from "./macros/aws.js" with { type: 'macro' }

interface AwsCidrRegions {
    prefixes: Prefix[]
}

interface Prefix {
    ip_prefix: string
    region: string
}

const backup = await aws()
const backupDate = date()

const {prefixes}: AwsCidrRegions = await fetch("https://ip-ranges.amazonaws.com/ip-ranges.json").then((res) => res.json() as any).catch(() => {
    console.info("Network error: unable to connect. Reverting to backup from", backupDate)
    return JSON.parse(backup)
})

const regions = new Set(prefixes.map(r => r.region))

const selection = await consola.prompt("AWS region:", {
    type: "select",
    options: Array.from(regions),
    cancel: "undefined",
    initial: "TypeScript",
});

const ipRanges = prefixes.filter(r => r.region === selection).map(ip => ip.ip_prefix)

const format = await consola.prompt("Formato:", {
    type: "select",
    options: ["Array", "Surge v5"],
    cancel: "undefined",
    initial: "TypeScript",
});

console.info(format === "Array" ? JSON.stringify({ [selection!]: ipRanges }, null, 4) : `OR,(${ipRanges.map(r => `(IP-${r.includes("::") ? "CIDR6" : "CIDR"},${r})`).join(", ")})`)
export async function aws() {
    return JSON.stringify(await fetch("https://ip-ranges.amazonaws.com/ip-ranges.json").then(r => r.json()), null, 4)
}

export function date() {
    return new Date().toISOString()
}
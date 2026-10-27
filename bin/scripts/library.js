export function ServerList(ns) {
    const ServerList = [];
    const queue = ["home"];
    while (queue.length > 0) {
        const current = queue.shift();
        if (!ServerList.includes(current)) {
            ServerList.push(current);
            const neighbors = ns.scan(current);
            for (const neighbor of neighbors) {
                if (!ServerList.includes(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }
    }
    return ServerList;
}
export const Scripts {
    rootScript = "/bin/scripts/root.js"
}
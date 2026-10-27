/** This script aims to keep running a loop through the known available servers. It checks for the ports needed open to gain root access. 
 * When requirements are met, programs are run to open the ports and then root access is acquired through running NUKE.exe */
/** @param {NS} ns */
import { ServerList } from "/bin/scripts/library"
export async function main(ns) {
    ns.disableLog("ALL"); ns.clearLog();
    const home = "home"
    const serverList = ServerList(ns);

    /** Set a loop to run while there are still servers with no root access. */
    while (serverList.filter(s => !ns.hasRootAccess(s)).length > 0) { 
        /** Call the unrooted Server list */
        const unrootedServer = serverList.filter(s => !ns.hasRootAccess(s));
        /**Every loop check for amount of ports able to open */
        let portsOpen = 0;
        if (ns.fileExists("BruteSSH.exe", home)) portsOpen++;
        if (ns.fileExists("FTPCrack.exe", home)) portsOpen++;
        if (ns.fileExists("relaySMTP.exe", home)) portsOpen++;
        if (ns.fileExists("HTTPWorm.exe", home)) portsOpen++;
        if (ns.fileExists("SQLInject.exe", home)) portsOpen++;
        /** Loop through every unrooted server */
        for (let server of unrootedServer) {
            /** Check if you have enough programs to open required ports */
            const portsReq = ns.getServerNumPortsRequired(server);
            /** If we don't, continue to next server */
            if (portsReq > portsOpen) {
                continue;
            } 
            /** If we do: Open all ports and NUKE to gain root access */
            else {
                ns.brutessh(server);
                ns.ftpcrack(server);
                ns.relaysmtp(server);
                ns.httpworm(server);
                ns.sqlinject(server);
                ns.nuke(server);
                ns.print(`✅Rooted ${server}`);
            }
        }
        /** After running through the entire list sleep for 1 minute */
        ns.print(`💤Ran through all servers. Sleeping for 1 minute.`);
        await ns.sleep(60000);  
    }
    /** After there are no unrooted servers left shut down */
    ns.print(`Rooted all servers. Shutting down.`);
    return;
}
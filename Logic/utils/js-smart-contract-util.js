/*
* This file contains functions for the use of your test file.
* It doesn't require any changes for immediate use.
*/


'use strict';

const fs = require('fs-extra');
const yaml = require('js-yaml');
const URL = require('url');
const os = require('os');
const path = require('path');

class SmartContractUtil {

    static async getConnectionProfile() {
        const homedir = os.homedir();

        const connectionProfilePath = path.join(homedir, '.fabric-vscode', 'environments', 'Local Fabric', 'gateways', 'Org1', 'Org1.json');

        const connectionProfileContents = await fs.readFile(connectionProfilePath, 'utf8');
        if (connectionProfilePath.endsWith('.json')) {
            return JSON.parse(connectionProfileContents);
        } else if (connectionProfilePath.endsWith('.yaml') || connectionProfilePath.endsWith('.yml')) {
            return yaml.safeLoad(connectionProfileContents);
        }
    }
    
    static async submitTransaction(gateway, contractName, functionName, args) {
        // Submit transaction
        const network = await gateway.getNetwork('mychannel');
        let contract;
        if (contractName !== '') {
            contract = await network.getContract(contractName);
        } else {
            throw new Error('Please define contract name!');
        }
        const responseBuffer = await contract.submitTransaction(functionName, ...args);
        return responseBuffer;
    }

    static async checkIdentityInWallet(fabricWallet,identityName) {
        const userExists = await fabricWallet.exists(identityName);
        if (!userExists) {
            return false;
        } else {
            return true;
        }
    }
    

    // Checks if URL is localhost
    static isLocalhostURL(url) {
        const parsedURL = URL.parse(url);
        const localhosts = [
            'localhost',
            '127.0.0.1'
        ];
        return localhosts.indexOf(parsedURL.hostname) !== -1;
    }

    // Used for determining whether to use discovery
    static hasLocalhostURLs(connectionProfile) {
        const urls = [];
        for (const nodeType of ['orderers', 'peers', 'certificateAuthorities']) {
            if (!connectionProfile[nodeType]) {
                continue;
            }
            const nodes = connectionProfile[nodeType];
            for (const nodeName in nodes) {
                if (!nodes[nodeName].url) {
                    continue;
                }
                urls.push(nodes[nodeName].url);
            }
        }
        return urls.some((url) => this.isLocalhostURL(url));
    }
}

module.exports = SmartContractUtil;

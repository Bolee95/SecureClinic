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

const fabricNetwork = require('fabric-network');

class SmartContractUtil {

    static async checkIdentityNameWithRole(identityName, identityRole) {
        let roleCheckValid = identityName.includes(identityRole);
        if (roleCheckValid) {
            return;
        } else {
            throw new Error(`Error check failed. Identity is not associated with role --> ${identityRole}.`);
        }
    }

    static async getConfiguredGateway(fabricWallet, identityName) {

        // Retrieving connection profile 
        const connectionProfile = await SmartContractUtil.getConnectionProfile();

        // Retrieving gateway API and setting up configuration
        const gateway = new fabricNetwork.Gateway();
        const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled = true;

        // Setting up Gateway parameters
        const options = {
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled,
            },
            identity: identityName,
            wallet: fabricWallet,
        };

        // Connecting to Gateway
        await gateway.connect(connectionProfile, options);
        return gateway;
    }

    static async getFileSystemWallet() {
        const homedir = os.homedir();
        const walletPath = path.join(homedir,  '.fabric-vscode', 'environments', 'Local Fabric', 'wallets', 'Org1');
        const fabricWallet = new fabricNetwork.FileSystemWallet(walletPath);
        return fabricWallet;
    }

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
        const stringifiedArgs = JSON.stringify(args);
        const responseBuffer = await contract.submitTransaction(functionName, stringifiedArgs);
        return responseBuffer;
    }

    static async checkIdentityInWallet(fabricWallet,identityName) {
        const userExists = await fabricWallet.exists(identityName);
        if (userExists) {
            return;
        } else {
            throw new Error('User already enrolled!');
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

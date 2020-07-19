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
const projectName = "Secure Clinic";

class SmartContractUtil {

    static async checkIdentityNameWithRole(identityName, identityRole) {
        // let roleCheckValid;
        // if(Array.isArray(identityRole)) {
        //     for (const role of identityRole) {
        //         if(identityName.includes(role)){
        //             return;
        //         }
        //     }
        // } else {
        //     roleCheckValid = identityName.includes(identityRole);
        //     if (roleCheckValid) {
        //         return;
        //     } 
        // }
        // throw new Error(`Error check failed. Identity is not associated with role --> ${identityRole}.`);
        return;
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
        const walletPath = path.join(homedir,  '.fabric-vscode', 'environments', projectName, 'wallets', 'Org1');
        const fabricWallet = new fabricNetwork.FileSystemWallet(walletPath);
        return fabricWallet; 
    }

    static async getConnectionProfile() {
        const homedir = os.homedir();

        const connectionProfilePath = path.join(homedir, '.fabric-vscode', 'environments', projectName, 'gateways', 'Org1', 'Org1.json');

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
        let responseBuffer;

        if (Array.isArray(args)) {
            responseBuffer = await SmartContractUtil.submitTransactionMultipleArgs(contract, functionName, args);
        }
        else if (args) {
            responseBuffer = await contract.submitTransaction(functionName, args);
        }
        else {
            responseBuffer = await contract.submitTransaction(functionName);
        }
        return responseBuffer;
    }

    static async submitTransactionMultipleArgs(contract, functionName, args) {
        let result;
        if (args.length == 2) {
            console.log(args[0]);
            console.log(args[1]);
            result = await contract.submitTransaction(functionName, args[0], args[1]);
        } else if (args.length == 3) {
            result = await contract.submitTransaction(functionName, args[0], args[1], args[2]);
        } else if (args.length == 4) {
            result = await contract.submitTransaction(functionName, args[0], args[1], args[2], args[3]);
        } else {
            throw new Error('Check submitTransactionMultipleArgs method, cannot receive more parameters currently.');
        }
        return result;
    }

    static async checkIdentityInWallet(fabricWallet,identityName) {
        // const userExists = await fabricWallet.exists(identityName);
        // if (userExists) {
        //     return;
        // } else {
        //     throw new Error('There is no such user in system!');
        // }
        return;
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

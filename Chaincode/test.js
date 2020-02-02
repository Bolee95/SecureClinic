const fs = require('fs');
const lineReader = require('readline');
const path = require('path');
const http = require('http');


const user =  {
    name: 'Bogdan',
    surname: 'Ilic',
    parents: [
        {
            name: 'Novica',
            surname: 'Ilic',
        },
        {
            name: 'Sladjana',
            surname: 'Kocic',
        }
    ],
    scrool: 'Grdelica',
};


const patients = [
    {
        name: 'Bogdan',
        surname: 'Ilic',
        jmbg: '1234567890',
        lbo: '2314613123',
        ID: 'q123dbft34324',
        sick_history:
        {
            'MP1': 'N',
            'GP2': 'A',
            'AS1': 'N',
            'TF2': 'A'
        },
        current_status: 'NOT_ACTIVE',
        docs_id: {
           'Asdaewq2331' : 'V',
           '23sdag34524' : 'I',
           '2123sdt4532' : 'V'
        }
    },
    {
        name: 'Darko',
        surname: 'Ilic',
        jmbg: '1234567890',
        lbo: '2314613123',
        ID: 'q123dbft34323',
        sick_history:
        {
            'MP1': 'N',
            'GP2': 'A',
            'AS1': 'N',
            'TF2': 'A'
        },
        current_status: 'NOT_ACTIVE',
        docs_id: {
           'Asdaewq2331' : 'V',
           '23sdag34524' : 'I',
           '2123sdt4532' : 'V'
        }
    },
    {
        name: 'Viktor',
        surname: 'Djikic',
        jmbg: '1234567890',
        lbo: '2314613123',
        ID: 'q123dbft34321',
        sick_history:
        {
            'MP1': 'N',
            'GP2': 'A',
            'AS1': 'N',
            'TF2': 'A'
        },
        current_status: 'NOT_ACTIVE',
        docs_id: {
           'Asdaewq2331' : 'V',
           '23sdag34524' : 'I',
           '2123sdt4532' : 'V'
        }
    },
];

function testForPatients() {
    //console.log(JSON.stringify(patients[0]));
    console.log([patients[0].sick_history]);

    // Getting keys and values of nested structures in JSON string
    const obj = JSON.parse(JSON.stringify(patients[0]));
    var keys = Object.keys(obj.sick_history);
    console.log(keys);
    var values = Object.values(obj.sick_history);
    //console.log(values);

    // Trying to change patient... IT'S WORKING!!!
    var patient1 = patients[0];
    const currentVal = patient1["docs_id"]["2123sdt4532"];
    if (currentVal == null) {
        patient1["docs_id"]["novifajleta"] = "V"
        console.log(patient1);
    } else {
        console.log("There is value like that...");
    }
}

async function main() {
    var rd = lineReader.createInterface({
        input: fs.createReadStream('./testfile.txt'),
        output: process.stdout,
        console: true
    });

    console.log(user);
    rd.on('line', function(line) {
        const arr = line.split(' ');//.map(function(val) {
        //});
        var userDictionary = {};
        userDictionary["jmbg"] = arr[0];
        userDictionary["lbo"] = arr[1];
        userDictionary["uniqueID"] = arr[4];

        const sickness = arr[5];//.substring(1, arr[5].length - 1);

        console.log(sickness);
    });
    /*
    for (const prop in user.parents) {
        console.log(`${prop}: ${user.parents[prop].name}`);
    }
    */
   console.log(user.parents);
}
//main()
testForPatients()
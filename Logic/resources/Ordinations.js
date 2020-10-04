let ordinations = [
    {
        "ordinationName" : "Kartiohirurgija",
        "ordinationCode" : "CZ",
        "services": [ 
            {
                "serviceName": "Koronarografija srca",
                "serviceCode": "AA",
                "waitingTime": "50"
            },
            {
                "serviceName": "Revaskularzacija miokarda",
                "serviceCode": "AB",
                "waitingTime": "100"
            },
            {
                "serviceName": "Ugradnja trajnog veštačkog vodiča srca",
                "serviceCode": "AC",
                "waitingTime": "365"
            },
            {
                "serviceName": "Ugradnja veštačkih valvula",
                "serviceCode": "AD",
                "waitingTime": "400"
            }
        ]
    },
    {
        "ordinationName" : "Hirurgija",
        "ordinationCode" : "RB",
        "services": [ 
            {
                "serviceName": "Ugradnja endoproteza kuka - Bezcementna proteza",
                "serviceCode": "BA",
                "waitingTime": "150"
            },
            {
                "serviceName": "Ugradnja endoproteza kuka - Cementrna proteza",
                "serviceCode": "BB",
                "waitingTime": "200"
            },
            {
                "serviceName": "Ugradnja endoproteza kuka - Reviziona proteza",
                "serviceCode": "BC",
                "waitingTime": "250"
            },
            {
                "serviceName": "Ugradnja endoproteza kuka - Hibridna proteza",
                "serviceCode": "BD",
                "waitingTime": "50"
            },
            {
                "serviceName": "Ugradnja endoproteza kolena - Bezcementna proteza",
                "serviceCode": "BE",
                "waitingTime": "300"
            },
            {
                "serviceName": "Ugradnja endoproteza kolena - Cementrna proteza",
                "serviceCode": "BF",
                "waitingTime": "400"
            },
            {
                "serviceName": "Ugradnja endoproteza kolena - Reviziona proteza",
                "serviceCode": "BG",
                "waitingTime": "500"
            },
            {
                "serviceName": "Ugradnja endoproteza kolena - Hibridna proteza",
                "serviceCode": "BH",
                "waitingTime": "100"
            }
        ]
    }
]

module.exports = { ordinations };
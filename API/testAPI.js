
function initTestMethods(expressApp) {
    expressApp.post("/test", (req, res) => {
       
        console.log(req.fields["test1"]);
     
        res.end();
        
        //console.log(req.body["test"]);
        //const id = req.fo.id;
        //console.log("ID is " + id);
        
		// res.json(["test1", "test2"]);
	});
}

module.exports = initTestMethods;
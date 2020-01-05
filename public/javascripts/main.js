function DOM( string ){
    var {Cc, Ci} = require("chrome");
    var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
    console.log("PARSING OF DOM COMPLETED ...");
    return (parser.parseFromString(string, "text/html"));
};
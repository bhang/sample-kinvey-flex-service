const sdk = require('kinvey-flex-sdk'),
      request = require('request');

// sdk.service({"sharedSecret": "gabbagabbahey"}, (err, flex) => {
sdk.service((err, flex) => {    
    
    // Flex Data Sample
    function getAllOrOneGHLicense(context, complete, modules) {
        const options = {
            headers: {
                "User-Agent": "request",
                "Accept": "application/vnd.github.drax-preview+json"
            }
        };  

        let url = "https://api.github.com/licenses";
        if (context.entityId) {
            url = `${url}/${context.entityId}`;
        }
        console.log("About to make call to GH API: " + url);
        request.get(url, options, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                try {
                    const resp_body = JSON.parse(body);
                    return complete().setBody(resp_body).ok().next();
                } catch (e) {
                    return complete().setBody("Error parsing GH API json").runtimeError().next();
                }
            } else {
                console.log(err);
                return complete().setBody("Error hitting GH API for license list: " + response.statusCode).runtimeError().next();
            }
        });

    }

    const gh_licenses = flex.data.serviceObject('gh_licenses');
    gh_licenses.onGetAll(getAllOrOneGHLicense);
    gh_licenses.onGetById(getAllOrOneGHLicense);

    // Flex Function Sample
    function getRedLineSchedule(context, complete, modules) {
    request.get('http://developer.mbta.com/Data/Red.json', (err, response, body) => {
      // if error, return an error
      if (err) {
        return complete().setBody("Could not complete request").runtimeError().done();
      }
      //otherwise, return the results
      return complete().setBody(body).ok().done();
    });
   }

   flex.functions.register('getMBTARedLineSchedule', getRedLineSchedule);
});
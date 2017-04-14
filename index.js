const sdk = require('kinvey-flex-sdk'),
      request = require('request');

// sdk.service({"sharedSecret": "gabbagabbahey"}, (err, flex) => {
sdk.service((err, flex) => {    
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
        
        request.get(url, options, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                try {
                    const resp_body = JSON.parse(body);
                    return complete().setBody(resp_body).ok().next();
                } catch (e) {
                    return complete().setBody("Error parsing GH API json").runtimeError().next();
                }
            } else {
                return complete().setBody("Error hitting GH API for license list: " + response.statusCode).runtimeError().next();
            }
        });

    }

    const gh_licenses = flex.data.serviceObject('gh_licenses');
    gh_licenses.onGetAll(getAllOrOneGHLicense);
    gh_licenses.onGetById(getAllOrOneGHLicense);
});
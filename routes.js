var googlePlaces    = require('googleplaces'),
    keys            = require('./config'),
    TextSearch      = googlePlaces(keys.GOOGLE_PLACES,'json').textSearch,
    PlaceDetails    = googlePlaces(keys.GOOGLE_PLACES,'json').placeDetailsRequest;

module.exports = function(app){
    app.post('/api/location',retrievePlace);
}

function retrievePlace(req, resp){

    const userValue = req.body.search;   // user's search value
    const allPlaces = [];               // future search results

    console.log('Searching... '+ userValue);

    // Google Places API text search
    TextSearch({query: userValue}, (error, places) =>  {
        if (error) console.log(error);

        // create array of just place_ids, limited by maxResults to limit API calls
        var maxResults = 20;
        const placeIds = places.results.map( function(place){ return place.place_id }).slice(0,maxResults);

        // forEach PlaceID, request Place Details from Google API
        // counter updates after each call, then returns all data on last call
        let counter = 1;
        placeIds.forEach((id, index, sourceArray) => {
            PlaceDetails({"placeid":id}, function(error, place){
                allPlaces.push(place.result);
                if (counter === sourceArray.length) {
                    resp.send(allPlaces);
                    console.log('Finished.');
                }
                counter += 1;
            });
        });
    });
}

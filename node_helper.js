var NodeHelper = require("node_helper");
var axios = require("axios"); // Using axios for HTTP requests

module.exports = NodeHelper.create({
    start: function() {
        console.log(this.name + " helper started...");
    },

    getEventData: function(apiKey, organizerId) {
        var config = {
            method: 'get',
            url: `https://www.eventbriteapi.com/v3/organizers/${organizerId}/events/?status=live`,
            headers: { 
                'Authorization': 'Bearer ' + apiKey 
            }
        };

        axios(config)
        .then((response) => {
            // Assuming the response data structure is correct
            this.sendSocketNotification("EVENT_DATA_RESULT", response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_EVENT_DATA") {
            this.getEventData(payload.apiKey, payload.organizerId);
        }
    }
});

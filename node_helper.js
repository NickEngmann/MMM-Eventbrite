var NodeHelper = require("node_helper");
var request = require("request"); // You might need to install the request package or use another way to perform HTTP requests

module.exports = NodeHelper.create({
    start: function() {
        console.log(this.name + " helper started...");
    },

    getEventData: function(apiKey, organizerId) {
        var options = {
            url: `https://www.eventbriteapi.com/v3/organizers/${organizerId}/events/?status=live`,
            headers: {
                'Authorization': 'Bearer ' + apiKey
            }
        };

        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                this.sendSocketNotification("EVENT_DATA_RESULT", data);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_EVENT_DATA") {
            this.getEventData(payload.apiKey, payload.organizerId);
        }
    }
});

var NodeHelper = require("node_helper");
var axios = require("axios"); // Using axios for HTTP requests

module.exports = NodeHelper.create({
    start: function() {
        console.log(this.name + " helper started...");
    },

    getEventData: async function(apiKey, organizerId) {
        const headers = {
            'Authorization': 'Bearer ' + apiKey
        };

        let allEvents = [];
        let continuation = null;
        let hasMore = true;

        try {
            // Fetch all pages of events
            while (hasMore) {
                let url = `https://www.eventbriteapi.com/v3/organizers/${organizerId}/events/?status=live`;
                if (continuation) {
                    url += `&continuation=${continuation}`;
                }

                const response = await axios.get(url, { headers });
                const events = response.data.events || [];
                allEvents = allEvents.concat(events);

                // Check for more pages
                const pagination = response.data.pagination || {};
                hasMore = pagination.has_more_items || false;
                continuation = pagination.continuation;
            }

            // Send all events back
            this.sendSocketNotification("EVENT_DATA_RESULT", { events: allEvents });
        } catch (error) {
            console.log("Error fetching Eventbrite data:", error.message);
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_EVENT_DATA") {
            this.getEventData(payload.apiKey, payload.organizerId);
        }
    }
});

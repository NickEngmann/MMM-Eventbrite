Module.register("MMM-Eventbrite", {
    defaults: {
        updateInterval: 1800000, // How often to fetch new data (in milliseconds)
        rotateInterval: 25000, // How often to switch between events (in milliseconds)
        apiKey: "",
        organizerId: "",
        doNotShow: [] // Default to an empty array if not specified
    },

    getStyles: function() {
        return ["MMM-Eventbrite.css"];
    },

    currentEventIndex: 0, // Keep track of which event is currently displayed

    start: function() {
        this.events = []; // Initialize your events array
        this.sendSocketNotification("GET_EVENT_DATA", {apiKey: this.config.apiKey, organizerId: this.config.organizerId});
        setInterval(() => {
            this.sendSocketNotification("GET_EVENT_DATA", {apiKey: this.config.apiKey, organizerId: this.config.organizerId});
        }, this.config.updateInterval);

        // Set up rotation of events
        setInterval(() => {
            if(this.events.length > 0) {
                this.currentEventIndex = (this.currentEventIndex + 1) % this.events.length;
                this.updateDom(1000); // Smooth transition between events, 1000ms animation
            }
        }, this.config.rotateInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "EVENT_DATA_RESULT") {
            // First map the events to a simplified structure
            let events = payload.events.map(event => ({
                name: event.name.text || "undefined",
                summary: event.summary || "undefined",
                logoOriginalUrl: event.logo ? event.logo.original.url : "undefined",
                url: event.url || "undefined",
                start: event.start.local || "undefined",
                end: event.end.local || "undefined"
            }));

            // Now filter the events based on doNotShow config, if applicable
            events = this.filterEvents(events);

            this.events = events;
            this.currentEventIndex = 0; // Reset to start from the first event upon receiving new data
            this.updateDom(1000); // Use animation for transition
        }
    },

    filterEvents: function(events) {
        if (!this.config.doNotShow || !Array.isArray(this.config.doNotShow)) {
            return events; // Return early if doNotShow is not configured
        }

        return events.filter(event => {
            for (let pattern of this.config.doNotShow) {
                try {
                    let regex = new RegExp(pattern);
                    if (regex.test(event.name)) {
                        return false; // Exclude this event
                    }
                } catch (e) {
                    console.log("Warning: Invalid regex in doNotShow config:", pattern);
                    // Optionally, continue to the next pattern or return true to keep the event
                    return true; // Keep the event, assuming the pattern is invalid
                }
            }
            return true; // Include this event if none of the patterns matched
        });
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "event-module-wrapper";
        
        if (this.events.length > 0) {
            const event = this.events[this.currentEventIndex]; // Get the current event to display

            var eventName = document.createElement("div");
            eventName.className = "event-name"; // Add class name
            eventName.innerHTML = `${event.name}`;
            wrapper.appendChild(eventName);

            var eventSummary = document.createElement("div");
            eventSummary.className = "event-summary"; // Add class name
            eventSummary.innerHTML = `${event.summary}`;
            wrapper.appendChild(eventSummary);

            if (event.logoOriginalUrl !== "undefined") {
                var eventLogo = new Image();
                eventLogo.className = "event-logo"; // Add class name
                eventLogo.src = event.logoOriginalUrl;
                eventLogo.alt = "Event Logo";
                wrapper.appendChild(eventLogo);
            }

            if (event.url !== "undefined") {
                var eventUrl = document.createElement("div");
                eventUrl.className = "event-url"; // Add class name
                eventUrl.innerHTML = `${event.url}`;
                wrapper.appendChild(eventUrl);
            }

            if (event.url !== "undefined") {
                var qrCodeImage = new Image();
                qrCodeImage.className = "event-qr-code"; // Add class name
                qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(event.url)}`;
                qrCodeImage.alt = "QR Code";
                qrCodeImage.style.paddingTop = "10px";
                qrCodeImage.style.width = "350px";
                wrapper.appendChild(qrCodeImage);
            }

            var startDateTime = new Date(event.start);
            var formattedStart = startDateTime.toLocaleString('en-US', {
                timeZone: 'America/New_York', // Adjusted to automatically handle DST
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            });
            var eventStart = document.createElement("div");
            eventStart.className = "event-start";
            eventStart.innerHTML = `Start: ${formattedStart}`;
            wrapper.appendChild(eventStart);

            var endDateTime = new Date(event.end);
            var formattedEnd = endDateTime.toLocaleString('en-US', {
                timeZone: 'America/New_York', // Adjusted to automatically handle DST
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            });
            var eventEnd = document.createElement("div");
            eventEnd.className = "event-end";
            eventEnd.innerHTML = `End: ${formattedEnd}`;
            wrapper.appendChild(eventEnd);

        } else {
            wrapper.innerHTML = "Loading events...";
        }

        return wrapper;
    }

});

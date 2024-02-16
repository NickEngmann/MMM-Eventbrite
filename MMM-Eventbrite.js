Module.register("MMM-Eventbrite", {
    defaults: {
        updateInterval: 1800000, // How often to fetch new data (in milliseconds)
        rotateInterval: 25000, // How often to switch between events (in milliseconds)
        apiKey: "B3KRL5DE67LAOPZ3WQEE",
        organizerId: "52408308"
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
        console.log("Results",payload);
        if (notification === "EVENT_DATA_RESULT") {
            this.events = payload.events.map(event => ({
                name: event.name.text || "undefined",
                summary: event.summary || "undefined",
                logoOriginalUrl: event.logo ? event.logo.original.url : "undefined",
                url: event.url || "undefined",
                start: event.start.local || "undefined",
                end: event.end.local || "undefined"
            }));
            this.currentEventIndex = 0; // Reset to start from the first event upon receiving new data
            this.updateDom(1000); // Use animation for transition
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        
        if (this.events.length > 0) {
            const event = this.events[this.currentEventIndex]; // Get the current event to display

            var eventName = document.createElement("div");
            eventName.innerHTML = `Name: ${event.name}`;
            wrapper.appendChild(eventName);

            var eventSummary = document.createElement("div");
            eventSummary.innerHTML = `Summary: ${event.summary}`;
            wrapper.appendChild(eventSummary);

            if (event.logoOriginalUrl !== "undefined") {
                var eventLogo = new Image();
                eventLogo.src = event.logoOriginalUrl;
                eventLogo.alt = "Event Logo";
                eventLogo.style.width = "400px"; // Adjust the size as needed
                wrapper.appendChild(eventLogo);
            }

            // Displaying the Event URL as text
            if (event.url !== "undefined") {
                var eventUrl = document.createElement("div");
                eventUrl.innerHTML = `URL: ${event.url}`;
                wrapper.appendChild(eventUrl);
            }

            // QR Code for Event URL
            if (event.url !== "undefined") {
                var qrCodeImage = new Image();
                qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(event.url)}`;
                qrCodeImage.alt = "QR Code";
                qrCodeImage.style.paddingTop = "10px";
                wrapper.appendChild(qrCodeImage);
            }

            // Formatting the start time
            var startDateTime = new Date(event.start);
            var formattedStart = startDateTime.toLocaleString('en-US', { timeZone: 'EST', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
            var eventStart = document.createElement("div");
            eventStart.innerHTML = `Start: ${formattedStart} EST`;
            wrapper.appendChild(eventStart);

            // Formatting the end time
            var endDateTime = new Date(event.end);
            var formattedEnd = endDateTime.toLocaleString('en-US', { timeZone: 'EST', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
            var eventEnd = document.createElement("div");
            eventEnd.innerHTML = `End: ${formattedEnd} EST`;
            wrapper.appendChild(eventEnd);
        } else {
            wrapper.innerHTML = "Loading events...";
        }

        return wrapper;
    }

});

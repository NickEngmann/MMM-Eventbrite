Module.register("MMM-Eventbrite", {
    defaults: {
        updateInterval: 1800000, // How often to fetch new data (in milliseconds)
        rotateInterval: 25000, // How often to switch between events (in milliseconds)
        apiKey: "",
        organizerId: "52408308"
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
            var formattedStart = startDateTime.toLocaleString('en-US', { timeZone: 'EST', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
            var eventStart = document.createElement("div");
            eventStart.className = "event-start"; // Add class name
            eventStart.innerHTML = `Start: ${formattedStart} EST`;
            wrapper.appendChild(eventStart);

            var endDateTime = new Date(event.end);
            var formattedEnd = endDateTime.toLocaleString('en-US', { timeZone: 'EST', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
            var eventEnd = document.createElement("div");
            eventEnd.className = "event-end"; // Add class name
            eventEnd.innerHTML = `End: ${formattedEnd} EST`;
            wrapper.appendChild(eventEnd);
        } else {
            wrapper.innerHTML = "Loading events...";
        }

        return wrapper;
    }

});

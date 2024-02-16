# MMM-Eventbrite

The MMM-Eventbrite module displays upcoming events from Eventbrite on your Magic Mirror. This module allows you to specify an organizer and display their public events, keeping you informed about upcoming events without leaving your mirror.

## Screenshot


![MMM-Eventbrite Screenshot](img/preview.jpeg)


## Installation

1. Navigate to your Magic Mirror's modules directory:

```sh
cd ~/MagicMirror/modules
```

2. Clone the MMM-Eventbrite repository:

```sh
git clone https://github.com/yourusername/MMM-Eventbrite.git
```

3. Change into the newly cloned module's directory:

```sh
cd MMM-Eventbrite
```

4. Install the module's dependencies:

```sh
npm install
```

## Configuration

To use the MMM-Eventbrite module, you need to add it to the `config/config.js` file in your Magic Mirror's directory. Here is an example configuration:

```js
{
    module: "MMM-Eventbrite",
    position: "middle_center",
    config: {
        apiKey: "YOUR_EVENTBRITE_API_KEY",
        organizerId: "YOUR_ORGANIZER_ID"
    }
}
```

### Configuration Options

| Option         | Description                                           |
| -------------- | ----------------------------------------------------- |
| `apiKey`       | **Required** Your Eventbrite API key.                 |
| `organizerId`  | **Required** The Eventbrite organizer ID.             |

## Dependencies

* An internet connection to fetch events from Eventbrite.
* The `npm` packages installed via `npm install` within the module directory.

## Notes

- Make sure to replace `"YOUR_EVENTBRITE_API_KEY"` and `"YOUR_ORGANIZER_ID"` with your actual Eventbrite API key and organizer ID.
- You can find your API key and organizer ID in your Eventbrite account settings.

## Updating

To update the module to the latest version, pull the changes from this repository and reinstall the dependencies:

```sh
cd ~/MagicMirror/modules/MMM-Eventbrite
git pull
npm install
```
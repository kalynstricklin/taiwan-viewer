# OpenSensorViewer

**_Project Under Development_**

OpenSensorViewer is Web App for OpenSensorHub enabling interaction and visualization with sensors and observations 
served by OpenSensorHub server instances. 

The following features are currently supported:

- Open Standards
  - OGC Standards
    - SensorML (https://www.opengeospatial.org/standards/sensorml)
    - Sensor Web API (**TODO: ADD LINK**)
    - Sensor Web Enablement (https://www.ogc.org/standards/swes)
- Integration with OpenSensorHub
  - Server Management
    - Configure 1 or more OpenSensorHub servers from which to gather systems and observations
    - Local store of configured servers
    - Request SensorML Capabilities from any configured server
    - Request Description of Systems through Sensor Web API
  - Observables
    - Ability to turn on and off selected data streams for Observation
  - Real Time and Playback of Data Streams
    - Time Synchronization in Playback Mode
- Integration with Cesium JS as Mapping Engine
- Minimalist User Interface

## Building:

Currently, requires osh-js as a linked npm package, in the future osh-js will be added as an npm package dependency. 
At present, however, you must checkout osh-js and link it with OpenSensorViewer as follows:

    git clone https://github.com/opensensorhub/osh-js.git
    git checkout dev
    cd osh-js
    npm install
    npm link

### Development

    git clone https://github.com/opensensorhub/osh-viewer.git
    cd osh-viewer
    npm install
    npm link osh-js
    npm start 

### Release

    git clone https://github.com/opensensorhub/osh-viewer.git
    cd osh-viewer
    npm install
    npm link osh-js
    npm run build 

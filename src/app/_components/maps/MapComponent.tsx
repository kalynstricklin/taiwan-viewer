"use client"

import PointMarkerLayer from "osh-js/source/core/ui/layer/PointMarkerLayer";
import LeafletView from "osh-js/source/core/ui/view/map/LeafletView";
import Box from "@mui/material/Box";
import '../../style/map.css';
import "leaflet/dist/leaflet.css"
import SosGetFois from 'osh-js/source/core/datasource/sos/SosGetFois.datasource';
import L from "leaflet";


export default function MapComponent() {

    let sosGetFois = new SosGetFois('fois', {
        endpointUrl: 'http://localhost:8282/sensorhub/api/',
        procedureId: '',
        tls: true
    });

    let leafletView = new LeafletView({
        container: "mapcontainer",
        autoZoomOnFirstMarker: false,
        layers: [
            new PointMarkerLayer({
                dataSourceId: sosGetFois.id,
                getLocation: (f: any) => {
                    let pos = f.shape.pos.split(" ");
                    return {
                        x: parseFloat(pos[1]),
                        y: parseFloat(pos[0])
                    }
                },
                getDescription:(f: any) => {
                    let pos = f.shape.pos.split(" ");
                    return  f.description + "<br/>" +
                        "Latitude: " + pos[0] + "°<br/>" +
                        "Longitude: " + pos[1] + "°"
                },
                getMarkerId:(f: any) => f.id,
                icon: 'images/circle.svg',
                iconAnchor: [12, 41],
                getLabel: (f: any) =>  f.id,
                labelColor: '#000000',
                labelSize: 28,
                labelOffset: [0, 10],
                iconSize: [25,41]

            }),
        ]
    });

    leafletView.map.setView(new L.LatLng(42.406025,-76.060832), 7);

    sosGetFois.connect();

    // const leafletViewRef = useRef<typeof LeafletView | null>(null);
    // const [locationList, setLocationList] = useState<StationWithLocation[] | null>(null);
    // const mapcontainer: string = "mapcontainer";
    //
    // const [isInit, setIsInt] = useState(false);
    //
    // const {laneMapRef} = useContext(DataSourceContext);
    // const [dataSourcesByLane, setDataSourcesByLane] = useState<Map<string, LaneDSColl>>(new Map<string, LaneDSColl>());
    // const laneMap = useSelector((state: RootState) => selectLaneMap(state));
    //
    // const [dsLocations, setDsLocations] = useState([]);

    // useEffect(() =>{
    //     if(locationList == null || locationList.length === 0 && laneMap.size > 0) {
    //         let locations: StationWithLocation[] = [];
    //         laneMap.forEach((value, key) => {
    //             if (laneMap.has(key)) {
    //                 let ds: LaneMapEntry = laneMap.get(key);
    //
    //                 dsLocations.map((dss) => {
    //                     const locationSources = ds.datasourcesBatch.filter((item) => (item.properties.resource === ("/datastreams/" + dss.properties.id + "/observations")))
    //
    //                     const laneWithLocation: StationWithLocation = {
    //                         stationName: key,
    //                         locationSources: locationSources,
    //                     };
    //
    //                     locations.push(laneWithLocation);
    //
    //                     }
    //                 )
    //             }
    //         });
    //         setLocationList(locations);
    //     }
    // },[laneMap, dsLocations]);
    //
    // /*****************lane status datasources******************/
    // const datasourceSetup = useCallback(async () => {
    //     // @ts-ignore
    //     let laneDSMap = new Map<string, LaneDSColl>();
    //
    //     let locationDs: any[] = [];
    //
    //     for (let [laneid, lane] of laneMapRef.current.entries()) {
    //         laneDSMap.set(laneid, new LaneDSColl());
    //         for (let ds of lane.datastreams) {
    //
    //             let idx: number = lane.datastreams.indexOf(ds);
    //             let rtDS = lane.datasourcesRealtime[idx];
    //             let batchDS = lane.datasourcesBatch[idx];
    //             let laneDSColl = laneDSMap.get(laneid);
    //
    //             if (ds.properties.observedProperties[0].definition.includes("http://www.opengis.net/def/property/OGC/0/SensorLocation") && !ds.properties.name.includes('Rapiscan') || ds.properties.observedProperties[0].definition.includes('http://sensorml.com/ont/swe/property/LocationVector')) {
    //                 laneDSColl.addDS('locBatch', batchDS);
    //                 locationDs.push(ds);
    //             }
    //
    //         }
    //         setDsLocations(locationDs);
    //         setDataSourcesByLane(laneDSMap);
    //     }
    // }, [laneMapRef.current]);
    //
    //
    //
    // useEffect(() => {
    //     datasourceSetup();
    // }, [laneMapRef.current]);


    // useEffect(() => {
    //
    //     if (!leafletViewRef.current && !isInit) {
    //         let view = new LeafletView({
    //             container: mapcontainer,
    //             layers: [],
    //
    //             autoZoomOnFirstMarker: true
    //         });
    //         console.log('new view created')
    //         leafletViewRef.current = view;
    //         setIsInt(true);
    //     }
    //
    // }, [isInit]);
    //
    // useEffect(() => {
    //     if(locationList && locationList.length > 0 && isInit){
    //         locationList.forEach((location) => {
    //             location.locationSources.forEach((loc: any) => {
    //                 let newPointMarker = new PointMarkerLayer({
    //                     name: location.stationName,
    //                     dataSourceId: loc.id,
    //                     getLocation: (rec: any) => {
    //                         return ({x: rec.location.lon, y: rec.location.lat, z: rec.location.alt})
    //                     },
    //                     label: `<div class='popup-text-lane'>` + location.stationName + `</div>`,
    //                     markerId: () => this.getId(),
    //                     icon: '/default.svg',
    //                     iconColor: 'rgba(0,0,0,1.0)',
    //                     // getIcon: {
    //                     //     dataSourceIds: [loc.getId()],
    //                         // handler: function (rec: any) {
    //                         //     if (location.status === 'Alarm') {
    //                         //         return  '/alarm.svg';
    //                         //     } else if (location.status.includes('Fault')) {
    //                         //         return  '/fault.svg';
    //                         //     } else{
    //                         //         return '/default.svg'
    //                         //     }
    //                         // }
    //                     // },
    //                     labelColor: 'rgba(255,255,255,1.0)',
    //                     labelOutlineColor: 'rgba(0,0,0,1.0)',
    //                     labelSize: 20,
    //                     iconAnchor: [16, 16],
    //                     labelOffset: [-5, -15],
    //                     iconSize: [16, 16],
    //                     // description: getContent(location.status, location.statioName),
    //                 });
    //                 leafletViewRef.current?.addLayer(newPointMarker);
    //             });
    //             location.locationSources.map((src: any) => src.connect());
    //         });
    //     }
    //
    // }, [locationList, isInit]);


    /***************content in popup************/
    // function getContent(status: string, laneName: string) {
    //
    //     return (
    //         `<div id='popup-data-layer' class='point-popup'><hr/>
    //             <h3 class='popup-text-status'>Status: ${status}</h3>
    //             <button onClick='location.href="./lane-view?name=${laneName}"' class="popup-button" type="button">VIEW LANE</button>
    //         </div>`
    //     );
    // }

    return (
        <Box id="mapcontainer" style={{width: '100%', height: '900px'}}></Box>
    );
}
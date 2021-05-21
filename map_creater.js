// ---------------------- IMPORTS -------------------------------

// #############################################################
// ----------------------- MAP ---------------------------------
// #############################################################

/*
const southwest = L.latLng([-17.95542878997259, 22.029783055733848]); 
const northeast = L.latLng([-13.349751739428944, 30.868284111140948]);
*/ 

const southwest = L.latLng([-18.695892367534807, 21.326658029569522]); 
const northeast = L.latLng([-12.712903258910305, 31.357175699395302]);

const bounds = L.latLngBounds(southwest, northeast); 

 

var map = L.map('map', {maxBounds : bounds}).setView([-16.170046439036582, 26.122190317600644], 8);

var bound = map.getBounds();
console.log(bounds); 

L.control.scale().addTo(map);

map.options.maxZoom = 15;


// #############################################################
// ------------------------- ICONS------------------------------
// #############################################################


const standardMapIcon = new L.icon({
  iconUrl: "./Icons/On Call Africa_Logo.png",
  
  iconSize:     [80, 40], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [0, 40],
  popupAnchor:  [40, -40],
}) 

const ruralHealthPostIcon = new L.icon({
  iconUrl: "./Icons/ruralHealthPostIcon.png",
  
  iconSize:     [40, 40], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [20, 40],
  popupAnchor:  [-0, -40]
  
}) 

const outReachPostIcon = new L.icon({
  iconUrl: "./Icons/outreachposticon.png",
  
  iconSize:     [40, 40], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [20, 30],
  popupAnchor:  [-0, -40]
  
}) 


// ##############################################################
// ----------------------- BASE LAYERS --------------------------
// ##############################################################

function layerGroupMaker(arrMarkers) {
  var newLayer = L.layerGroup(arrMarkers); 
  return newLayer; 
}

// street map 
var street_view = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=qFGn0FanTKV7R8DShikU',{
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 7,
    maxzoom: 15,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true,
    maxBoundsViscosity: 1.0,
    }).addTo(map);


// satalite map 
var stat_view = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=qFGn0FanTKV7R8DShikU',{
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 7,
    maxZoom: 15, 
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
    });

// toner 
var toner = L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=qFGn0FanTKV7R8DShikU',{
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
  });

// -18.279119300632832, 21.22778106941376 bottom left 
// -8.165492562794787, 35.60888471651336 top right 

// ##############################################################
// --------------- PROVIENCE & DISTRICT LAYER -------------------
// ##############################################################

function ProvinceStyle(colour, weight) { 
  return { 
    stroke: true,
    color: colour,
    weight: weight,
    //opacity: 0.7,
    fill: true,
    fillColor: "#000000",
    fillOpacity: 0,
    smoothFactor: 0.5,
    //interactive: false,
    popupAnchor:  [-3, -76]
}}


function customOptions(offsetArr) {
  return {
    
      //direction : right,
      offset : offsetArr, 
      'className' : 'toolTipsRHC'
    } 
  } 


const southern = L.geoJSON(southernProvinceData, {style : ProvinceStyle("#000000", 5), 
onEachFeature : function(feature, layer) {
  layer.bindTooltip(feature.properties.name, {className : "toolTipsRHC"});
}}); 

const western = L.geoJson(westernProvinceData, {style : ProvinceStyle("grey", 5), 
onEachFeature : function(feature, layer) {
  layer.bindTooltip(feature.properties.name, {className : "toolTipsRHC"});
}}); 

arrOfSouth = [southern];
arrOfWest = [western]; 

var southernProvinces = layerGroupMaker(arrOfSouth);
var westernProvience = layerGroupMaker(arrOfWest); 

// ##############################################################
// ----------------- PROGRAM LAYER FUNCTIONS --------------------
// ##############################################################

function ProvinceStyleWorking(colourBorder, colourFill, weight, fillOpac) { 
  return { 
    stroke: true,
    color: colourBorder,
    weight: weight,
    //opacity: 0.7,
    fill: true,
    fillColor: colourFill,
    fillOpacity: fillOpac,
    smoothFactor: 0.5,
    //interactive: false,
    popupAnchor:  [-3, -76]
}}; 

function styleDynamic(name, dataObj, colourBorder, colourFill) {
  // changes the fill of the ploygon if the district name is included in the list of data. 
  dataArr = Object.keys(dataObj)
  if (dataArr.includes(name)) {
    return ProvinceStyleWorking(colourBorder, colourFill, 5, 0.8); 
  }
  return ProvinceStyleWorking(colourBorder, null, 5, 0); 
  
}

function onEachDynamic(name, dataObj) {
  const dataArr = Object.keys(dataObj); 
  if (dataArr.includes(name)) {
    const message = `<br><font id="values"> OCA began working here in ` + dataObj[name].toString();
    return name + message;
  }
  else {
    return name;
  }
}


// ##############################################################
// -------------------------- WASH -----------------------------
// ##############################################################

//washDistricts = ["Kazungula", "Mwandi", "Sesheke"]; 


const southernWASH = L.geoJSON(southernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, washDistricts, "#000000", "#4fe2ff")
}, 
onEachFeature : function(feature, layer) { 
  layer.bindTooltip(onEachDynamic(feature.properties.name, washDistricts), {className : "toolTipsRHC"}); 
}}); 

const westernWASH = L.geoJson(westernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, washDistricts, "#000000", "#4fe2ff")
}, 
onEachFeature : function(feature, layer) {
  layer.bindTooltip(onEachDynamic(feature.properties.name, washDistricts), {className : "toolTipsRHC"}); 
}}); 


washLayerArr = [southernWASH, westernWASH]; 
washLayer = layerGroupMaker(washLayerArr); 

// ##############################################################
// -------------------- HEALTH FACALITY -------------------------
// ##############################################################

//healthFacalityDistricts = ["Zimba", "Kazungula"]

const southernHealthFaclity = L.geoJSON(southernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, healthFacalityDistricts, "#000000", "#f95c5c")
}, 
onEachFeature : function(feature, layer) { 
  layer.bindTooltip(onEachDynamic(feature.properties.name, healthFacalityDistricts), {className : "toolTipsRHC"}); 
}})

const westernHealthFaclity = L.geoJSON(westernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, healthFacalityDistricts, "#000000", "#f95c5c")
}, 
onEachFeature : function(feature, layer) {
  layer.bindTooltip(onEachDynamic(feature.properties.name, healthFacalityDistricts), {className : "toolTipsRHC"}); 
}})

healthFacalityArr = [southernHealthFaclity, westernHealthFaclity]; 

// Create community layers to also be added 

const communitesToPlot = Object.keys(communityData); 
const numCommunitesToPlot = communitesToPlot.length; 

console.log(communitesToPlot); 
console.log(numCommunitesToPlot); 

for (let i=0; i<numCommunitesToPlot; i++) { 
  let currentCommunity = communityData[communitesToPlot[i]]
  let community = new AddCommunities(currentCommunity["points"], currentCommunity["routes"], currentCommunity["stats"])
  setTimeout(function() { return null } , 500);
  console.log("Finidhed time out"); 
  let communityLayer = community.getFullLayer;
  healthFacalityArr.push(communityLayer); 
}

console.log(healthFacalityArr); 

/*
kanyangaOutreachPosts = "./kanyanga/kanyangaOutreachPosts.gpx";
kanyangaRoutesGPX = "./kanyanga/kanyangaRoutes.gpx";

var community = new AddCommunities(kanyangaOutreachPosts, kanyangaRoutesGPX, KanyangaStatsData).getFullLayer; 
*/ 


healthFacalityLayer = layerGroupMaker(healthFacalityArr);

// ##############################################################
// ------------------- Digital Health -------------------------
// ##############################################################

//digitalHealthdistricts = ["Livingstone", "Kazungula"]

const southernDigitalHealth = L.geoJSON(southernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, digitalHealthdistricts, "#000000", "#e1ff21")
}, 
onEachFeature : function(feature, layer) {
  layer.bindTooltip(onEachDynamic(feature.properties.name, digitalHealthdistricts), {className : "toolTipsRHC"}); 
}})

const westernDigitalHealth = L.geoJSON(westernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, digitalHealthdistricts, "#000000", "#e1ff21")
}, 
onEachFeature : function(feature, layer) {
  layer.bindTooltip(onEachDynamic(feature.properties.name, digitalHealthdistricts), {className : "toolTipsRHC"}); 
}})


digitalHealthArr = [southernDigitalHealth, westernDigitalHealth]; 
digitalHealthLayer = layerGroupMaker(digitalHealthArr); 

// ##############################################################
// ------------------- PERMENANT MARKERS ------------------------
// ##############################################################

// Marker for OCA headquaters 

var OCA_HQ_location = {
  "type": "FeatureCollection",
  "features": [ 
    { "type": "Feature",
      "properties": { name : "OCA Headquarters"},
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.861478447914124,
          -17.855036389209820
        ]
      }
    }
  ], 
}

const OCAMarker = L.geoJSON(OCA_HQ_location, { pointToLayer: function(feature, latlng) {
  return L.marker(latlng, {icon : standardMapIcon}); 
} } ).bindPopup(OCA_HQ_location.features[0].properties.name, {'className' : "OCAMarker"}).addTo(map).openPopup(); 


// #############################################################
// --------------------- LAYER CONTROL--------------------------
// #############################################################


//map.fitBounds(community.getBounds());


var baseMaps = [{ 
    groupName : "Base Maps",
    layers : {
      "Street View" : street_view, 
      "Satellite View" : stat_view,
      // "Black and White": toner 
    }
}];

/*
var markers = { 
  //"kOCA" : OCAMarker,
  "Kanyanga" : community,
  //"Western Districts" : districts,
  "Western" : westernProvience,
  "Southern" : southernProvinces
};

var marker2 = {
  "WASH" : washLayer,
  "Health Facality Improvment" : healthFacalityLayer,
  "Digital Health" : digitalHealthLayer
}
*/

// L.control.layers(baseMaps, markers, {collapsed : false}).addTo(map);

//$(".leaflet-control-layers-overlays").prepend("<label>Provinces</label>");



var markersGrouped = [ 
  {
    groupName : "Provinces", 
    expanded : false, 
    layers : {
      "Southern" : southernProvinces, 
      "Western" : westernProvience
    }
  },
  {
    groupName : "Programs", 
    expanded : true, 
    layers : {
      "Model Package for HCF" : healthFacalityLayer,
      "WASH In HCF" : washLayer,
      "Digital Health" : digitalHealthLayer
    }
  }
]

var options = {
  container_width 	: "300px",
  container_maxHeight : "350px", 
  group_maxHeight     : "100px",
  exclusive       	: false,
  collapsed : false
};


L.control.groupedLayers(baseMaps, markersGrouped, options).addTo(map); 









// #############################################################
// ------------------- UNUSED CURRENTLY -----------------------
// #############################################################

 /*
// marker for kanganga 

var kanyangaMarker = L.marker([-17.60655, 26.453533]).bindPopup("Kanyanga Rural Health Centre");

// var markers for Matabele 

// var matabeleMarker = L.marker([-17.864367, 26.450883]).bindTooltip("Matabele Outreach Post")

// marker for the OCA office

var OCA_GeJSON_raw = {
    "type": "FeatureCollection",
    "features": [ 
      { "type": "Feature",
        "properties": { name : "OCA Headquarters"},
        "geometry": {
          "type": "Point",
          "coordinates": [
            25.861478447914124,
            -17.855036389209820
          ]
        }
      }
    ], 
  }

//console.log(omnivoreTest)

//console.log(omnivoreTest);
 //console.log(omnivoreTest._layers.feature.properties.name); 



// Import 
/*
var KanyangaToMatebele = kanToMatabele; 

var KanyangaToMatebeleName = KanyangaToMatebele.name

var kanToMatabeleRoute = L.geoJSON(KanyangaToMatebele, { style: RouteStyles("red"), onEachFeature : function(feature, layer) { 
  layer.bindTooltip(KanyangaToMatebele.name + "<br> Distance: 38.1km </br>"); 
}})
*/ 

//console.log("OnTest: " + typeof omnivoreTest);

/*
KanyangaToMatebeleGPX = "./kanyanga/KanyangaRoutes.gpx"
var GPXTest = new L.GPX(KanyangaToMatebeleGPX, {async: true}).on('loaded', function(e) {
  map.fitBounds(e.target.getBounds())
  console.log("Distance: " + e.target.get_distance());
});

console.log(GPXTest)

//var layer = omnivore.gpx(KanyangaToMatebeleGPX)


/*
const GPXgeo = new L.GPX(KanyangaToMatebeleGPX, {async: true, marker_options: {
  startIconUrl: null,
  endIconUrl:   null,
  shadowUrl:    null,
}, polyline_options : RouteStyles("red")})
.on('loaded', function(e) {
  var gpx = e.target; 
  var name = e.target.get_name();
  console.log(name);
  gpx.bindTooltip(name);
  //control.addOverlay(gpx, gpx.get_name());
 }).addTo(map);
*/ 


/*
$.ajax(kanyangaRoutesGPX).done(function(xml) {
  let testGeo = toGeoJSON.gpx(xml);
  console.log("HERE" + JSON.stringify(testGeo.features[0].geometry));
  //console.log("Distance: " + lengthCaculator(testGeo.features[0].geometry)); 
  var test = L.geoJSON(testGeo).addTo(map);
  //console.log(test);
});




var GPXTest = new L.GPX(KanyangaToMatebeleGPX, {async: true}).on('loaded', function(e) {
  //map.fitBounds(e.target.getBounds())
  //console.log("Name : " + e.target.get_name());
  e.target.bindTooltip("Distance: " + e.target.get_distance());
});

//.log(GPXTest); 

//console.log("Distance is: " + distance);

*/ 

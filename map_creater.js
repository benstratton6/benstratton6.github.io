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

 

var map = L.map('map', {maxBounds : bounds}).setView([-16.170046439036582, 26.122190317600644], 7);

var bound = map.getBounds();
console.log(bounds); 

L.control.scale().addTo(map);

map.options.maxZoom = 16;


// #############################################################
// ------------------------- ICONS------------------------------
// #############################################################


const standardMapIcon = new L.icon({
  //iconUrl: "./Icons/On Call Africa_Logo.png",
  iconUrl : "Icons/map-marker-icon_34392.png", 
  
  iconSize:     [50, 50], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [15, 50],
  popupAnchor:  [10, -55],
}) 

const ruralHealthPostIcon = new L.icon({
  iconUrl: "./Icons/ruralHealthPostIcon.png",
  
  iconSize:     [40, 40], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [20, 40],
  popupAnchor:  [-0, -40],
  
}) 

const outReachPostIcon = new L.icon({
  iconUrl: "./Icons/outreachposticon.png",
  //iconUrl : "./Icons/icons8-plus-30.png", 

  iconSize:     [40, 40], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [20, 30],
  popupAnchor:  [-0, -40]
  
}) 

const hospitalIcon = new L.icon({
  iconUrl: "./Icons/hospitalIcon.png", 

  iconSize:     [40, 40], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [20, 30],
  popupAnchor:  [0, 0]
  
}) 

const officeIcon = new L.icon({
  iconUrl: "./Icons/healthOfficeIcon.png", 

  iconSize:     [40, 40], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [20, 30],
  popupAnchor:  [0, 0]
  
}) 

const otherClinic = new L.icon({
  iconUrl: "./Icons/otherclinics.png", 

  iconSize:     [40, 40], // size of the icon
  shadowSize:   [100, 100], // size of the shadow
  iconAnchor:   [20, 30],
  popupAnchor:  [0, 0]
  
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

const western = L.geoJson(westernProvinceData, {style : ProvinceStyle("#535353", 5), 
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

function onEachDynamic(layer, name, dataObj, url) {
  const dataArr = Object.keys(dataObj);  
  if (dataArr.includes(name)) {
    if (typeof url === "string") {
      layer.on('click', function() {
        window.open(url, "_self")
      })
    }
    const message = `<br><font id="values"> OCA began working here in ` + dataObj[name].toString();
    return [name + message, {className : "toolTipsRHC", sticky : true, offset : L.point(100, 100), direction : 'right'}];
  }
  else {
    return [name, {className : "toolTipsRHC"}];
  }
}


// ##############################################################
// -------------------------- WASH -----------------------------
// ##############################################################

washLinkURL = null; 

const southernWASH = L.geoJSON(southernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, washDistricts, "#000000", "#4fe2ff")
}, 
onEachFeature : function(feature, layer) { 
  const message = onEachDynamic(layer, feature.properties.name, washDistricts, washLinkURL)
  layer.bindTooltip(message[0], message[1]); 
}}); 

const westernWASH = L.geoJson(westernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, washDistricts, "#535353", "#4fe2ff")
}, 
onEachFeature : function(feature, layer) {
  const message = onEachDynamic(layer, feature.properties.name, washDistricts, washLinkURL);
  layer.bindTooltip(message[0], message[1]); 
}}); 


washLayerArr = [southernWASH, westernWASH]; 
washLayer = layerGroupMaker(washLayerArr); 


// ##############################################################
// -------------------- HEALTH FACALITY -------------------------
// ##############################################################

healthFacalityURL = null; 

const southernHealthFaclity = L.geoJSON(southernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, healthFacalityDistricts, "#000000", "#f95c5c")
}, 
onEachFeature : function(feature, layer) { 
  const message = onEachDynamic(layer, feature.properties.name, healthFacalityDistricts, healthFacalityURL)
  layer.bindTooltip(message[0], message[1]); 
}})

const westernHealthFaclity = L.geoJSON(westernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, healthFacalityDistricts, "#535353", "#f95c5c")
}, 
onEachFeature : function(feature, layer) {
  const message = onEachDynamic(layer, feature.properties.name, healthFacalityDistricts, healthFacalityURL)
  layer.bindTooltip(message[0], message[1]); 
}})

healthFacalityArr = [southernHealthFaclity, westernHealthFaclity]; 

// Create community layers to also be added 

const communitesToPlot = Object.keys(communityData); 
const numCommunitesToPlot = communitesToPlot.length; 

console.log(communitesToPlot); 
console.log(numCommunitesToPlot); 

for (let i=0; i<numCommunitesToPlot; i++) { 
  let currentCommunity = communityData[communitesToPlot[i]]
  let community = new AddCommunities(currentCommunity["points"], currentCommunity["routes"], currentCommunity["stats"], currentCommunity["URL"]).getFullLayer;
  console.log(currentCommunity["URL"]); 
  healthFacalityArr.push(community); 
}

healthFacalityLayer = layerGroupMaker(healthFacalityArr);

// for key
categoriesRHP = ['Rural Health Centre', 'Outreach Post']; 
iconsImagesRHP = ["Icons/ruralHealthPostIcon.png", "Icons/outreachposticon.png"]; 

// ##############################################################
// ------------------- Digital Health -------------------------
// ##############################################################

digitalHealthURL = null; 

const southernDigitalHealth = L.geoJSON(southernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, digitalHealthdistricts, "#000000", "#e1ff21")
}, 
onEachFeature : function(feature, layer) {
  const message = onEachDynamic(layer, feature.properties.name, digitalHealthdistricts, digitalHealthURL)
  layer.bindTooltip(message[0], message[1]); 
}})

const westernDigitalHealth = L.geoJSON(westernProvinceData, {style : function(feature) {
  return styleDynamic(feature.properties.name, digitalHealthdistricts, "#535353", "#e1ff21")
}, 
onEachFeature : function(feature, layer) {
  const message = onEachDynamic(layer, feature.properties.name, digitalHealthdistricts, digitalHealthURL)
  layer.bindTooltip(message[0], message[1]); 
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
} } ).bindPopup(`${OCA_HQ_location.features[0].properties.name}`, {'className' : "OCAMarker"}).addTo(map).openPopup(); 


// ##############################################################
// ------------- IMPORTANT OTHER FEATURES MARKERS ---------------
// ##############################################################

importantFeaturesArr = []; 

// HOSPITALS 
const livingstoneGeneral = L.marker([-17.84144894033052, 25.853454425537137], {icon : hospitalIcon}).bindTooltip("<font id=nameStyle>Livingstone General Hospital</font>"); 
importantFeaturesArr.push(livingstoneGeneral); 

const zimbaMission = L.marker([-17.317832093473495, 26.20335468459807], {icon : hospitalIcon}).bindTooltip("<font id=nameStyle>Zimba Mission Hospital</font>");
importantFeaturesArr.push(zimbaMission); 

// DISTRICT HEALTH OFFICES 
const livingstoneDHO = L.marker([-17.853783922094156, 25.858714500939616], {icon : officeIcon}).bindTooltip("<font id=nameStyle>Livingstone District Health Office</font>");
importantFeaturesArr.push(livingstoneDHO); 

// OTHER CLINICS 
const marambaClinic = L.marker([-17.847380784499567, 25.872039715393576], {icon : otherClinic}).bindTooltip("<font id=nameStyle>Maramba Clinic</font>"); 
importantFeaturesArr.push(marambaClinic);

const mahmatmaGhandiClinic = L.marker([-17.858147733338797, 25.842468701713756], {icon : otherClinic}).bindTooltip("<font id=nameStyle>Mahatma Gandhi Clinic</font>");
importantFeaturesArr.push(mahmatmaGhandiClinic);

importantFeatures = layerGroupMaker(importantFeaturesArr); 

// for key 
categoriesIntrestingFeat = ["Hospital", "District Health Office", "Clinic"]; 
iconsImagesIntrestingFeat = ["Icons/hospitalIcon.png", "Icons/healthOfficeIcon.png", "Icons/otherclinics.png"]; 

// #################################################################
// --------------------- KEY CREATION ------------------------------
// #################################################################

function keyCreator(categories, iconsImages) { 

  var div = L.DomUtil.create('div', 'info-legend');
  labels = ['<strong style="padding: 70px; font-weight: bolder; font-size: 20px; text-decoration: underline; ">Key</strong>']; 

  for (var i = 0; i < categories.length; i++) {

          div.innerHTML += 
          labels.push(
              '<i> <img id="image" src=' + iconsImages[i] + '> </i> <font style="position: relative; top: -15px;">' +  categories[i] + '</font>')
      }
      div.innerHTML = labels.join('<br>');
  return div;
};


// Key for rural health facaility improvment program 
var ruralHealthKey = L.control({position: 'bottomright'});

ruralHealthKey.onAdd = function (map) {
  return keyCreator(categoriesRHP, iconsImagesRHP); 
}

// key for intresting features 
var intrestingFeaturesKey = L.control({position: 'bottomleft'}); 
intrestingFeaturesKey.onAdd = function(map) {
  return keyCreator(categoriesIntrestingFeat, iconsImagesIntrestingFeat); 
}



// #################################################################
// --------------------- LAYER CONTROL------------------------------
// #################################################################


const baseMaps = [{ 
    groupName : "Base Maps",
    layers : {
      "Street View" : street_view, 
      "Satellite View" : stat_view,
      // "Black and White": toner 
    }
}];

const markersGrouped = [ 
  {
    groupName : "Provinces", 
    expanded : false, 
    exclusive : false,
    layers : {
      "Southern" : southernProvinces, 
      "Western" : westernProvience
    } 
  },
  {
    groupName : "Intresting Features", 
    expanded : false, 
    exclusive : false, 
    layers : {
      "Intresting Features" : importantFeatures
    }
  }, 
  {
    groupName : "Programs", 
    expanded : true, 
    exclusive : false, 
    layers : {
      "Model Package for HCF" : healthFacalityLayer,
      "WASH In HCF" : washLayer,
      "Digital Health" : digitalHealthLayer, 
    }
  }
]


const options = {
  container_width 	: "300px",
  container_maxHeight : "350px", 
  group_maxHeight     : "100px",
  exclusive       	: false,
  collapsed : false,
};


lcontrol = L.control.groupedLayers(baseMaps, markersGrouped, options).addTo(map);


// dynamic selection of layers 

map.on('overlayadd', function (eventLayer) {

  let currentLayer = eventLayer.name; 
  

  if (currentLayer === "Model Package for HCF") {
    ruralHealthKey.addTo(map);
    console.log("Removing Layers")
    setTimeout(() => { 
      map.removeLayer(washLayer); 
      map.removeLayer(digitalHealthLayer) }, 10); 
  } else if (currentLayer === "WASH In HCF") {
    map.removeControl(ruralHealthKey);
    setTimeout(() => { 
      map.removeLayer(healthFacalityLayer); 
      map.removeLayer(digitalHealthLayer) }, 10); 
  } else if (currentLayer === "Digital Health") {
    map.removeControl(ruralHealthKey); 
    setTimeout(() => { 
      map.removeLayer(healthFacalityLayer); 
      map.removeLayer(washLayer) }, 10); 
  }
  if (currentLayer === "Intresting Features") {
    setTimeout(() => {
      intrestingFeaturesKey.addTo(map);
    }, 10);  
  }
  
}); 

map.on('overlayremove', function(eventLayer) { 
  
  if (eventLayer.name === "Model Package for HCF") {
    setTimeout(() => {
      map.removeControl(ruralHealthKey);
    }, 10); 
  }
  if (eventLayer.name === "Intresting Features") {
    setTimeout(() => {
      map.removeControl(intrestingFeaturesKey); 
    }, 10);  
}})


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
class CaculateLength {     
    
    /**
    * Calculate the approximate distance between two coordinates (lat/lon)
    *
    * © Chris Veness, MIT-licensed,
    * http://www.movable-type.co.uk/scripts/latlong.html#equirectangular
    */

    distance(λ1,φ1,λ2,φ2) {
      var R = 6371000;
      var Δλ = (λ2 - λ1) * Math.PI / 180;
      var φ1 = φ1 * Math.PI / 180;
      var φ2 = φ2 * Math.PI / 180;
      var x = Δλ * Math.cos((φ1+φ2)/2);
      var y = (φ2-φ1);
      var d = Math.sqrt(x*x + y*y);
      return R * d;
    }

    calculateLength(lineString) {
      if (lineString.length<2)
          return 0;
      var result = 0;
      for (var i=1; i<lineString.length; i++)
          result += this.distance(lineString[i-1][0],lineString[i-1][1],
                            lineString[i  ][0],lineString[i  ][1]);
      return result;
    }

    lengthCaculator(geometry) {
      if (geometry.type === 'LineString') {
          //console.log("MADE IT HERE");
          return this.calculateLength(geometry.coordinates); }
      else if (geometry.type === 'MultiLineString')
          return geometry.coordinates.reduce(function(memo, coordinates) {
              return memo + this.calculateLength(coordinates);
          }, 0);
      else
          return null;
    }

  }; 

class AddCommunities { 
  
  
  
  constructor(pointsData, routesData, statsData) { 
        this.pointsData = pointsData;
        this.routesData = routesData;
        this.statsData = statsData; 
        
        // style layers to go with the omnivore layers 
        this.pointsStyleLayer; 
        this.routesStyleLayer;

        // constant values 
        this.routeColour; 
        this.routeWeight = 3; 
        this.routeOpacity = 0.7;

        this.routeDistances = {}; 

        // complete route and points layers 

        this.completePointsLayer; 
        this.completeRouteLayer; 
        
        this.fullLayer; 

        // STORAGE AS A TEST
        this.matabeleImage = "./Images/IMG_20210416_124839_648.jpg";


        // create the complete layer when class is constructed
        //this.routeLayer();
        //this.geometryForCaculation = 0;
        this.completeLayer(); 

        
    }
    /*
    get pointsData() {
        return this.pointsData; 
    }

    get routesData() {
        return this.routesData; 
    }
    */ 
    get getFullLayer() { 
        return this.fullLayer; 
    }

    
    // #############################################################
    // ------------------- ROUTES LAYER CREATION -------------------
    // #############################################################
    
    randomHexColour() { 
        // creates a random hex colour to be used on a route 

        let hexColor = "#" + Math.floor(Math.random() * 16777215).toString(16); 
        console.log(typeof hexColor)
        return hexColor; 
    }

    styleRoutes(feature) { 
        //return this.styleObject.bind(this.randomHexColour(), this.routeWeight, this.routeOpacity); 
        return {
          stroke: true,
          color: "#fcaf47",
          weight: 5,
          opacity: 0.7,
          //fill: true,
          //fillColor: "#7300e6",
          fillOpacity: 0,
          smoothFactor: 0.5,
          //interactive: false,
          //popupAnchor:  [-3, -76]
        }
      }

    customOptions(offsetArr, cssClass) {
        /* can pass this into the style layer to give it a css class and hence have greater control
         over the style */ 
        return {
            offset : offsetArr, 
            'className' : "toolTipsRHC"
        }
    }

    createRouteStyleLayer() { 
        /* creates the complete style layer for the route and store it in a variable accessible to the whole class */ 
        
        const distances = {}; 
        
        var routesStyleLayer = L.geoJson(null, {style : this.styleRoutes, 
            //onEachFeature : this.onEachFeatureRoutes}); 
            onEachFeature : function(feature, layer) { 
              /* caculates the distance of each route from it's coordinates 
              must be used inside the creation of the routes style layer only */ 
              
              var calTool = new CaculateLength; 
              const routeLength = calTool.lengthCaculator(feature.geometry);
              
              const name = feature.properties.name.split(" ")[2];
              distances[name] = routeLength; 
              //layer.bindTooltip(feature.properties.name);   

          }       
          })

        this.routeDistances = distances; 
        this.routeStyleLayer = routesStyleLayer; 
        //console.log(routesStyleLayer.getBounds());
        
    }

    routeLayer() { 
        // creates the complete layer, combining the data with the style and is then ready to add to the map
        this.createRouteStyleLayer(); 

        //const routeLayer = omnivore.gpx(this.routesData, null, this.routeStyleLayer)
        const routeLayer = omnivore.gpx(this.routesData, null, this.routeStyleLayer)
        
        //console.log("Routelayer")
        //console.log(JSON.stringify(routeLayer._layers))
        //console.log(Object.getOwnPropertyNames(routeLayer._layers))//._layers) //.feature.properties.name) 
        //console.log(this.routeStyleLayer); 
        //console.log("DISTACES: " + JSON.stringify(this.routeDistances));
        //console.log(routeLayer._layers);
        this.completeRouteLayer = routeLayer;

    }

    // #############################################################
    // -------------------- POINTS LAYER CREATION -----------------
    // #############################################################

    pointTOLayerPoints(feature, latlng) { 
        // checks if the point is a RHP and gives the correct ICON
        
        var name = feature.properties.name
        var length = name.length; 
        var letters = name.slice(length-3, length); 
        //console.log(letters)

        if (letters === "RHP") {
            return L.marker(latlng, {icon : ruralHealthPostIcon});
        }

        return L.marker(latlng, {icon : outReachPostIcon});
        
    } 

    textFromatterRHP(name, stats) { 
        const keys = Object.keys(stats); 
        const lengthKeys = keys.length; 

        let output = `<font id = nameStyle> ${name} </font>`; 

        for (let i=0; i<lengthKeys; i++){

            output += `<br>${keys[i]}: <font id=values>${stats[keys[i]].toString()}</font>`; 
        }
        return output;
    }

    textFromatterOutreach(name, distance, stats) {
        const keys = Object.keys(stats) 
        const lengthKeys = keys.length; 

        let output = `<font id = nameStyle> ${name} </font> <br> Distance from RHP: ${distance}`; 

        for (let i=0; i<lengthKeys; i++) {
            output += `<br>${keys[i]}: <font id=values>${stats[keys[i]].toString()}</font>`; 
        };
       
        return output

    }
    
    createPointsStyleLayer() { 
        // creates the style layer for the points and stores in a accesable varibale
        
        const routeDistances = this.routeDistances; 
        console.log("HERE"); 
        console.log(routeDistances); 
        console.log(routeDistances["Chilikwazi"]);
        const allStats = this.statsData; 
        const allStatsKeys = Object.keys(allStats); 
        const text = this.textFromatterOutreach; 
        const textRHP = this.textFromatterRHP; 

        const pointsStyleLayer = L.geoJson(null, {pointToLayer: this.pointTOLayerPoints,
        
        onEachFeature : function(feature, layer) {
        
        var name = feature.properties.name
        var nameSplit = name.split(" ")
        var length = name.length; 
        var letters = name.slice(length-3, length); 


        var distanceFromRHP = routeDistances[nameSplit[0]]; 
        console.log("Inside onEachFunction");
        //console.log("name :" + name); 
        //console.log("letters :" + letters); 
        //console.log("routes : " + this.routeDistances);
        //console.log("Distances: " + this.routeDistances); 

        if (nameSplit[1] === "RHP") {
            console.log("made it here"); 
            if (allStatsKeys.includes(name)) { 
                layer.bindTooltip(textRHP(name, allStats[name]), {className : "toolTipsRHC"})
            }
            else { 
                layer.bindTooltip(`<font id = "RHCStyle"> ${name} </font>`) // + feature.properties.notes);
            }
        }
        else {
          if (typeof distanceFromRHP === "number" && allStatsKeys.includes(name)) {
            console.log(1); 
            const roundedDistance = Math.floor(distanceFromRHP/100) / 10;
            layer.bindTooltip(text(name, roundedDistance, allStats[name]), {className : "toolTipsRHC"}); 

          }
          else if (typeof distanceFromRHP === "number") {
              console.log(2); 
            const roundedDistance = Math.floor(distanceFromRHP/100) / 10;
            layer.bindTooltip(text(name, roundedDistance, {}), {className : "toolTipsRHC"}); 
          } 
          else {
              console.log(3); 
               layer.bindTooltip(`<font id=nameStyle> ${name} </font>`, {className : "toolTipsRHC"});
          }
        }}
    }); 

        this.pointsStyleLayer = pointsStyleLayer; 

    }

    pointsLayer() { 
        this.createPointsStyleLayer(); 

        const pointsLayer = omnivore.gpx(this.pointsData, null, this.pointsStyleLayer)

        this.completePointsLayer = pointsLayer; 

        console.log(pointsLayer);

    }
    
    // #############################################################
    // -------------------- FINAL LAYER CREATION -------------------
    // #############################################################
    
    makeLayerGroup(arrLayers) {
        const newLayer = L.layerGroup(arrLayers);
        return newLayer;  
    }

    completeLayer() {
        // calls all the functions to create the complete layer 

        this.routeLayer(); 
        //setTimeout(10); 
        this.pointsLayer(); 
        
        //const my_bounds = this.routeLayer.getBounds()
        //console.log(my_bounds);

        this.fullLayer = this.makeLayerGroup([this.completePointsLayer, this.completeRouteLayer]);
    }

}
    


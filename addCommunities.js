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
  
  
  
  constructor(pointsData, routesData, statsData, URLData) { 
        this.pointsData = pointsData;
        this.routesData = routesData;
        this.statsData = statsData; 
        this.URLData = URLData; 
        
        // style layers to go with the omnivore layers 
        this.RHPStyleLayer; 
        this.outreachStyleLayer; 
        this.routesStyleLayer;

        this.routeDistances = {}; 

        // complete route and points layers 
        this.completeRHPLayer; 
        this.completeOutreachLayer; 
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

    get getRouteLayer() { 
        return this.completeRouteLayer; 
    }

    get getPointsLayer() { 
        return this.completeOutreachLayer; 
    }

    get getRHPLayer () { 
        return this.completeRHPLayer; 
    }


    
    // #############################################################
    // ------------------- ROUTES LAYER CREATION -------------------
    // #############################################################
    
    randomHexColour() { 
        // creates a random hex colour to be used on a route 

        let hexColor = "#" + Math.floor(Math.random() * 16777215).toString(16); 
        //console.log(typeof hexColor)
        return hexColor; 
    }

    styleRoutes(feature) { 
        //return this.styleObject.bind(this.randomHexColour(), this.routeWeight, this.routeOpacity); 
        return {
          stroke: true,
          color: "#ffffff",
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
        
        this.createRouteStyleLayer()

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
    // ----------------- OUTREACH LAYER CREATION -------------------
    // #############################################################

    nullChecker(input) {
        if (input === null) {
            return [];
        } else {
            return Object.keys(input); 
        }
    }

    pointTOLayerOutreach(feature, latlng, url) { 
        // checks if the point is a RHP and gives the correct ICON
        
        var name = feature.properties.name
        var length = name.length; 
        var letters = name.slice(length-3, length); 
        //console.log(letters)

        if (letters === "RHP" || letters === "RHC" || letters === "tal") {

            return null; 
        }
        
        return L.marker(latlng, {icon : outReachPostIcon});
        
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
    
    createOutreachStyleLayer() { 
        // creates the style layer for the points and stores in a accesable varibale
        
        const routeDistances = this.routeDistances; 
        const allStats = this.statsData; 

        const allStatsKeys = this.nullChecker(allStats); 

        const text = this.textFromatterOutreach; 
        const URL = this.URLData; 
        const pointsToLayer = this.pointTOLayerOutreach; 

        // console.log("Distances : "); 
        // console.log(routeDistances); 
        // console.log(Object.keys(routeDistances)); 


        const outreachStyleLayer = L.geoJson(null, {pointToLayer: function(feature, latlng) {
            return pointsToLayer(feature, latlng, URL); 
        }, 
        
        onEachFeature : function(feature, layer) {
        
        var name = feature.properties.name
        var nameSplit = name.split(" ")
        var length = name.length; 
        var letters = name.slice(length-3, length); 


        var distanceFromRHP = routeDistances[nameSplit[0]]; 

        // console.log("name: " + name); 
        // console.log("Distance : " + routeDistances[name])

        //console.log("name :" + name); 
        //console.log("letters :" + letters); 
        //console.log("routes : " + this.routeDistances);
        //console.log("Distances: " + this.routeDistances); 

        if (nameSplit[1] === "RHP" && nameSplit[1] === "RHC" && nameSplit[1] === "tal") {

            null; 
        }
        else {
          if (typeof distanceFromRHP === "number" && allStatsKeys.includes(name)) {
             
            const roundedDistance = Math.floor(distanceFromRHP/100) / 10;
            layer.bindTooltip(text(name, roundedDistance, allStats[name]), {className : "toolTipsRHC"}); 

          }
          else if (typeof distanceFromRHP === "number") {
            const roundedDistance = Math.floor(distanceFromRHP/100) / 10;
            layer.bindTooltip(text(name, roundedDistance, {}), {className : "toolTipsRHC"}); 
          } 
          else {
               layer.bindTooltip(`<font id=nameStyle> ${name} </font>`, {className : "toolTipsRHC"});
          }
        }}
    }); 

        this.outreachStyleLayer = outreachStyleLayer; 

    }

    outreachLayer() { 
        this.createOutreachStyleLayer(); 

        const outreachLayer = omnivore.gpx(this.pointsData, null, this.outreachStyleLayer); 

        this.completeOutreachLayer = outreachLayer; 

        // console.log("COMPLETE POINTS LAYER")
    }

    // #############################################################
    // -------------------- RHP LAYER CREATION ---------------------
    // #############################################################
    
    pointTOLayerRHP(feature, latlng, url) { 
        // checks if the point is a RHP and gives the correct ICON
        
        var name = feature.properties.name
        var length = name.length; 
        var letters = name.slice(length-3, length); 

        console.log("NAME: " + name + ", LETTERS: " + letters); 

        // console.log("LETTERS : " + letters); 

        if (letters !== "RHP" && letters !== "RHC" && letters !== "tal") {
            // console.log("I HAVE MADE IT INSIDE HERE where I dont want to be "); 
            return null;
        }

        if (letters === "RHP" || letters === "RHC") {
            // console.log("I HAVE MADE IT INSIDE HERE"); 
            let currentIcon = L.marker(latlng, {icon : healthFacalityIcon}); 

            if (typeof url === "string") {
                currentIcon.on('click', function(e) { 
                window.open(url);
            }); 
        } 
            return currentIcon; 
        } 
        else if (letters === "tal") {
            return L.marker(latlng, {icon : hospitalIcon}); 
        }
    } 
        

    textFromatterRHP(name, stats, url) { 
        const getKeys = (stats) => {
            if (stats === null) {
                return []
            }
            else {
                return Object.keys(stats); 
            }
        }

        const keys = getKeys(stats);

        const lengthKeys = keys.length; 

        let output = `<font id = nameStyle> ${name} </font>`; 

        if (stats !== null) {
            for (let i=0; i<lengthKeys; i++){

                output += `<br>${keys[i]}: <font id=values>${stats[keys[i]].toString()}</font>`; 
            }
        }

        if (typeof url === "string") {
            output += `<br> (Click for more information)`;
        }

        return output;
    }

    createRHPStyleLayer() { 
        // creates the style layer for the points and stores in a accesable varibale
        
        const allStats = this.statsData; 

        const allStatsKeys = this.nullChecker(allStats);

        const textRHP = this.textFromatterRHP; 
        const URL = this.URLData; 
        const pointsToLayer = this.pointTOLayerRHP;


        const RHPStyleLayer = L.geoJson(null, {pointToLayer: function(feature, latlng) {
            return pointsToLayer(feature, latlng, URL); 
        }, 
        
        onEachFeature : function(feature, layer) {
        
        var name = feature.properties.name
        var nameSplit = name.split(" ")
        var length = nameSplit.length; 
        //var letters = name.slice(length-3, length); 

        //console.log("name: " + name); 
        //console.log("Distance : " + routeDistances[name])

        if (nameSplit[length-1] !== "RHP" && nameSplit[length-1] !== "RHC" && nameSplit[length-1] !== "Hospital") {

            return null; 
        }
        else {
            console.log("NAME : " + name)
            if (allStatsKeys.includes(name)) { 
                layer.bindTooltip(textRHP(name, allStats[name], URL), {className : "toolTipsRHC"})
            }
            else { 
                layer.bindTooltip(textRHP(name, null, URL), {className : "toolTipsRHC"}) // + feature.properties.notes);
            }
        }
    
    }}
    ); 

        this.RHPStyleLayer = RHPStyleLayer; 

    }

    RHPLayer() { 
        this.createRHPStyleLayer(); 

        const RHPLayer = omnivore.gpx(this.pointsData, null, this.RHPStyleLayer); 

        this.completeRHPLayer = RHPLayer; 

        console.log("COMPLETE RHP LAYER")
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

        // try putting a promise in here that resolves to the points layer being created 

        if (this.routesData === null) {
            this.outreachLayer(); 

            this.RHPLayer(); 
        } else {

            this.routeLayer();
            
            this.outreachLayer(); 

            this.RHPLayer(); 
        }

        //this.fullLayer = this.makeLayerGroup([this.completeOutreachLayer, this.completeRouteLayer]);



    }

}
    


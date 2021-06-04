
// What districts are involved with which programs 

// ######## DISTRICT FOR WATERAID R2R WASH PROGRAM ##########
washDistricts = {"Kazungula": 2021, 
                 "Mwandi" : 2021, 
                 "Sesheke": 2021}; 

// ######## DISTRICT FOR HEALTH FACALITY IMPROVEMENT PROGRAM ##########
healthFacalityDistricts = {"Zimba" : 2021, 
                           "Kazungula" : 2021}

// ######## DISTRICT FOR DIGITAL HEALTH PROGRAM ##########
digitalHealthdistricts = {"Livingstone" : 2021, 
                          "Kazungula" : 2021}



// ######## the URL where you will be taken if filled in districted is clicked #########
washLinkURL = null; 
healthFacalityURL = null; 
digitalHealthURL = null; 


// HEALTH FACALITY DATA 

KanyangaStatsData = {
    "Kanyanga RHP" : {
        "Population" : 24695, 
        "No' Nurses" : 2,
        "No COs" : 1,
        "No CHA" : 1, 
        "No EHT" : 1,
        "No beds" : 5,
        "Solar Power" : "Yes (very limited)", 
        "Running Water" : "No", 
        "Most Common Illnesses" : "URTI, Diarrhoea, Musculoskeletal, Digestive illness, Dental", 
    },
    "Siakasipa" : {
        "No CHWs" : 10
    },
    "Simulelbana" : {
        "No CHWs" : 7
    },
    "Mazanzya" :  {
        "No CHWs" : 10
    },
    "Simusunge"  : {
        "No CHWs" : 10
    },
    "Siatuziba"  : {
        "No CHWs" : 10
    },
    "Matabele"  : {
        "No CHWs" : 10
    },
    "Safari"  : {
        "No CHWs" : 10
    },
    "Chilikwazi"  : {
        "No CHWs" : 10
    },
    "Masanzya"  : {
        "No CHWs" : 10
    },
    "Masite"  : {
        "No CHWs" : 7
    },
    "Nkungwa" : {
        "No CHWs" : 4
    }, 
    "Siejumba" : {
        "No CHWs" : 5
    }
}

KanyangaData = {
    "points" : "./kanyanga/kanyangaOutreachPosts.gpx",
    "routes" : "./kanyanga/kanyangaRoutes.gpx",
    "stats" : KanyangaStatsData,
    "URL" : "https://www.oncallafrica.org/kanyanga-rural-health-post"
}

KatapaziData = {
    "points" : "Katapazi/Katapazi_RHP.gpx",
    "routes" : null,
    "stats" : null, 
    "URL" : "https://www.oncallafrica.org/katapazi-rural-health-centre"
}

communityData = {
    "Kanyanga" : KanyangaData,
    "Katapazi" : KatapaziData
}

// WASH DISTRICT DATA 

firstData = {
    "points" : "WASHHealthCentres/washHealthCentres1.gpx",
    "routes" : null,
    "stats" : null, 
    "URL" : null
}

washDistrictsData = {
    "first" : firstData
}
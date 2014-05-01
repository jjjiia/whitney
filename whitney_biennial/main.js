function test(){
	//console.log("connected to js")
}
test()

//GLOBALS
var mapShown = true
var SHOULD_DRAW_MAPS = true
var artists = []
var csv = "DataSoFar_04262014_trimed_wiki.csv"

//DATA FUNCTION
d3.csv(csv, function(data){
	
	for(artist in data){
		artists.push(data[artist])
	}
	buildAgeDict(artists)
	
	drawYears(2000,1500)
	drawAges(artists,100,1)
	var calendarTallyData = dotCalendarTally(artists)
	var mapData = mapTally(filterData("All","All", "All"))	
	
	drawInitialAnimatedMap()
	
	d3.selectAll("#skipAnimation")
	.on("click", function(){
		d3.selectAll("#arcs *").remove()
		d3.selectAll("#main-nav *").remove()
		drawYears(100,10)
		d3.selectAll("#skipAnimation").remove()
		drawDataMap(filterData("All","All", "All"), 500, "#efefef", "#444")
	})
	
	d3.selectAll(".menu-calendar")
	.on("click", function(){
		SHOULD_DRAW_MAPS = false
		
		d3.selectAll("#main-nav *").remove()
		d3.selectAll("#arcs *").remove()
		d3.selectAll("#skipAnimation").remove()
		drawYears(100,10)		
		if (mapShown !=false){
			dotCalendarDraw(calendarTallyData)
		}
		mapShown = false
		d3.select("#detailsTitle").html("")
		d3.select("#details").html("")
	})
	
	d3.selectAll(".menu-map")
	.on("click", function(){
		SHOULD_DRAW_MAPS = true
		mapShown = true
		
		d3.selectAll("#main-nav *").remove()
		d3.selectAll("#calendar *").remove()
		d3.selectAll("#skipAnimation").remove()
		drawYears(100,10)		
		drawDataMap(filterData("All","All", "All"), 500, "#efefef", "#444")
		d3.select("#detailsTitle").html("")
		d3.select("#details").html("")
	})
})

//USES D3 datamaps library
function drawInitialAnimatedMap(){
	var interval = 800
	var speed = 1000
	var fill = "none"
	var stroke = "#444"
	setTimeout(function(){drawDataMap(filterData("1973","All", "All"), 0, "#efefef", "none")},0)
	setTimeout(function(){drawDataMap(filterData("1975","All", "All"), speed, fill, stroke)},0)	
	setTimeout(function(){drawDataMap(filterData("1977","All", "All"), speed, fill, stroke)},1*interval)	
	setTimeout(function(){drawDataMap(filterData("1979","All", "All"), speed, fill, stroke)},2*interval)
	setTimeout(function(){drawDataMap(filterData("1981","All", "All"), speed, fill, stroke)},3*interval)
	setTimeout(function(){drawDataMap(filterData("1983","All", "All"), speed, fill, stroke)},4*interval)
	setTimeout(function(){drawDataMap(filterData("1985","All", "All"), speed, fill, stroke)},5*interval)
	setTimeout(function(){drawDataMap(filterData("1987","All", "All"), speed, fill, stroke)},6*interval)
	setTimeout(function(){drawDataMap(filterData("1989","All", "All"), speed, fill, stroke)},7*interval)
	setTimeout(function(){drawDataMap(filterData("1991","All", "All"), speed, fill, stroke)},8*interval)
	setTimeout(function(){drawDataMap(filterData("1993","All", "All"), speed, fill, stroke)},9*interval)
	setTimeout(function(){drawDataMap(filterData("1995","All", "All"), speed, fill, stroke)},10*interval)
	setTimeout(function(){drawDataMap(filterData("1997","All", "All"), speed, fill, stroke)},11*interval)
	setTimeout(function(){drawDataMap(filterData("2000","All", "All"), speed, fill, stroke)},12*interval)
	setTimeout(function(){drawDataMap(filterData("2002","All", "All"), speed, fill, stroke)},13*interval)
	setTimeout(function(){drawDataMap(filterData("2004","All", "All"), speed, fill, stroke)},14*interval)
	setTimeout(function(){drawDataMap(filterData("2006","All", "All"), speed, fill, stroke)},15*interval)
	setTimeout(function(){drawDataMap(filterData("2008","All", "All"), speed, fill, stroke)},16*interval)
	setTimeout(function(){drawDataMap(filterData("2010","All", "All"), speed, fill, stroke)},17*interval)
	setTimeout(function(){drawDataMap(filterData("2012","All", "All"), speed, fill, stroke)},18*interval)
	setTimeout(function(){drawDataMap(filterData("2014","All", "All"), speed, fill, stroke)},19*interval)
}

function drawDataMap(data, speed, fill, stroke){
	if(!SHOULD_DRAW_MAPS){
		return
	}
    var map = new Datamap({
      scope: 'world',
      element: document.getElementById('arcs'),
      projection: 'mercator',
		bubblesConfig: {
		        borderWidth: 0,
				borderColor: 'red',
				},
		geographyConfig: {
		    popupOnHover: false,
		    highlightOnHover: false,
			borderWidth: .2,
			borderColor: 'none',
			fillOpacity: 0
		  },
	      fills: {
	        defaultFill: fill,
	      },
	      data: {
	        USA: {fillKey: 'defaultFill' }   
	      }
    })
	var artists = []
	for(artist in data){
		artists.push({
					origin: {
						latitude: data[artist]["b latitude"],
						longitude: data[artist]["b longitude"]
					},
					destination: {
						latitude: data[artist]["w latitude"],
						longitude: data[artist]["w longitude"]
					}
				})
	}
		var arcAttributes = {strokeWidth: .2, strokeColor:stroke, animationSpeed: speed, arcSharpness: 0.2, opacity: 0}
		map.arc(artists, arcAttributes)
}


function filterData(year, age, birthplace){
	targetYear =[]
	targetYearAge =[]
	targetYearAgeBirthplace = []
	
	for (artist in artists){
		if (year == "All"){
			targetYear.push(artists[artist])
		}else if (artists[artist]["year of exhibition"]!=undefined){
			if(artists[artist]["year of exhibition"] == year){
				targetYear.push(artists[artist])
			}
		}
	}
	for(artist in targetYear){
		if(age == "All"){
			targetYearAge.push(targetYear[artist])
		}else if (targetYear[artist]["age at the time"]!= undefined){
			if(targetYear[artist]["age at the time"]== age){
				targetYearAge.push(targetYear[artist])
			}
		}
	}
	for(artist in targetYearAge){
		if(birthplace == "All"){
			targetYearAgeBirthplace.push(targetYearAge[artist])
		}else if(targetYearAge[artist]["birthplace state"]!=undefined){
			if(targetYearAge[artist]["birthplace state"].toLowerCase()== birthplace.toLowerCase()){
				targetYearAgeBirthplace.push(targetYearAge[artist])
			}
		}
	}
	return targetYearAgeBirthplace
}

function dotCalendarTally(artists){
	var calendarTallyData = []
	var byYear = {
		"1973":{},"1975":{},"1977":{},"1979":{},
		"1981":{},"1983":{},"1985":{},"1987":{},"1989":{},
		"1991":{},"1993":{},"1995":{},"1997":{},
		"2000":{},"2002":{},"2004":{},"2006":{},"2008":{},
		"2010":{},"2012":{},"2014":{}
	}
	for(artist in artists){
		var currentYear = artists[artist]["year of exhibition"]
		var currentAge = artists[artist]["age at the time"]
		if(byYear[currentYear] != undefined){
			if (byYear[currentYear][currentAge]==undefined){
				byYear[currentYear][currentAge]=[]
				byYear[currentYear][currentAge].push(artists[artist])
			}else{
				byYear[currentYear][currentAge].push(artists[artist])
			}
		}
	}
	var lengthOnly = []
	for(year in byYear){
		var yearSum = filterData(year,"All", "All").length		
		for (var age =20; age < 100; age++ ){
			var ageSum = filterData("All", age, "All").length
			if(byYear[year][age]!=undefined){
				var yearPercentage = d3.round(byYear[year][age].length/yearSum*100)
				var agePercentage = d3.round(byYear[year][age].length/ageSum*100)
				calendarTallyData.push([year, age, byYear[year][age].length, byYear[year][age], yearPercentage, agePercentage])
				lengthOnly.push(byYear[year][age].length)
			}
		}
	}
	return(calendarTallyData)
}

function dotCalendarDraw(dataset){
	var w = 1100
	var h = 500
	//console.log("calendar data", dataset)
	
	var yearScale = d3.scale.linear()
	.domain([1973,2014])
	.range([20,h-20])
	
	var ageScale = d3.scale.linear()
	.domain([20,100])
	.range([60,w-20])
	
	var rScale = d3.scale.linear()
	.domain([1,19])
	.range([2,12])
	
	var rPercentScale = d3.scale.linear()
	.domain([1,19])
	.range([3,10])
	
	var dotCalendar = d3.select("body #calendar")
	.append("svg:svg")
	.attr("width", w)
	.attr("height", h)
	.append("g")
	.attr("class", "dot-calendar")
	
	var circles = dotCalendar.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("cx",function(d,i){
		return ageScale(d[1])
	})
	.attr("cy", function(d,i){
		return yearScale(d[0])
	})
	.attr("opacity",0)
	.attr("r",0)
	.transition()
	.duration(1000)
	.delay(function(d, i) { return i / 2 *3; })
	.attr("r", function(d,i){
		return rScale(d[2])
	})
	.attr("opacity", function(d){
		return 1
	})
	.attr("fill", "black");
	
	dotCalendar.selectAll("circle").on("mouseover", function(d){

	d3.select(this).style("fill", "#fff").style("stroke", "black").style("stroke-width", "2")
	})
	.on("mouseout", function(){
		if(!d3.select(this).classed("d3-clicked")) {
			d3.select(this).style("fill", "black").style("stroke", "none")
		}else{
			d3.select(this).style("fill", "#fff").style("stroke", "black").style("stroke-width", "2")
		}
	})
	.on("click", function(d){
		d3.selectAll(".dot-calendar circle").attr("class", "").style("fill", "black").style("stroke", "none")
		d3.select(this).attr("class", "d3-clicked").style("fill", "#fff").style("stroke", "black").style("stroke-width", "2")
	//var newString = JSON.parse(d[3])
		var newTable = dotText(d[3])
		//console.log(newTable)
		if(parseInt(d[2])==1){
			d3.select("#detailsTitle").html(d[0]+ ", there was "+d[2]+" artist aged "+d[1])
			d3.select("#details").html(d[4]+"% of all "+d[0]+" artists, and "+d[5]+"% of all "+d[1]+" year old artists<br/><br/>"+newTable)
		}else{
			d3.select("#detailsTitle").html(d[0]+ ", there were "+d[2]+" artists aged "+d[1])
			d3.select("#details").html(d[4]+"% of all "+d[0]+" artists, and "+d[5]+"% of all "+d[1]+" year old artists<br/><br/>"+newTable)
		}
		d3.selectAll("#skipAnimation").remove()
	})
}

function drawYears(duration, delay){
	//console.log("years")
	var years = ["1973", "1975", "1977", "1979", "1981", "1983", "1985", "1987", "1989", "1991", "1993", "1995", "1997", "2000", "2002", "2004", "2006", "2008", "2010", "2012", "2014"]
	var h =500
	var w = 50
	var yearScale = d3.scale.linear()
	.domain([1973,2014])
	.range([20,h-20])
	
	var timedYearScale = d3.scale.linear()
	.domain([1973,2014])
	.range([1,years.length])
	
	var yearlabels = d3.select("body #main-nav")
	.append("svg:svg")
	.attr("width", w)
	.attr("height", h)
	.append("g")
	.attr("class", "yearNav")
	
	yearlabels.selectAll("text")
	.data(years)
	.enter()
	.append("text")
	.text(function(d){
		return d
	})
	.attr("y", function(d,i){
		//console.log(years.length)
		//console.log(yearScale(d))
		return yearScale(d)+10
		//return i*23
	})
	.attr("x", function(d,i){
		return 0
	})
	.attr("opacity",0)
	.transition()
	.duration(duration)
	.delay(function(d, i) {return timedYearScale(d)/ 2 * delay; })
	.attr("opacity",1)
	
	
	yearlabels.selectAll("text").on("mouseover",function(d,i){
		d3.select(this).style("opacity", .3)
	})
	.on("mouseout",function(d,i){
		d3.select(this).style("opacity", 1)
	})
	.on("click", function(d,i){
		//console.log(filterData(d,"All", "All").length)
		//console.log(filterData(d,"All", "All"))
		var filteredData= filterData(d,"All", "All")
		var newTable = yearText(filteredData)
		d3.select("#detailsTitle").html("<span style = \"font-size:16px\">There were "+filterData(d,"All", "All").length+" artists in the "+d+" Biennial</span><br/>")
		d3.select("#details").html(newTable)
		d3.selectAll(".dot-calendar circle").attr("class", "").style("fill", "black").style("stroke", "none")
		d3.selectAll("#main-nav *").remove()
		drawYears(100,10)
		if(mapShown == true){
			d3.selectAll("#arcs svg").attr("opacity", 1).transition().duration(1000).attr("opacity", 0)
			d3.selectAll("#arcs svg").remove()
			SHOULD_DRAW_MAPS = true
			drawDataMap(filteredData, 500, "#eee", "#222")
			SHOULD_DRAW_MAPS = false
		}else{
			SHOULD_DRAW_MAPS = false
		}
		d3.selectAll("#skipAnimation").remove()
	})
}
function buildAgeDict(dataset){
	var ages = []
	for(age in dataset){
		var currentAge = (dataset[age]["age at the time"])
		if(currentAge != "none"){
		if(ages[age]==undefined){
			ages[age]=[]
			ages[age].push(currentAge)
		}else{
			ages[age].push(currentAge)
		}
	}
	}

return ages
}

function drawAges(dataset, duration, delay){
	//console.log("ages")
	//build age array
	//var ages = []
	//for(var age = 20; age < 90; age++){
	//	ages.push(age)
	//}
	var ages = []
	for(age in dataset){
		if(dataset[age]["age at the time"] != "none"){
			var currentAge = (dataset[age]["age at the time"])
			if(currentAge != 101){
				if(ages[age]==undefined){
					ages[age]=[]
					ages[age].push(currentAge)
				}else{
					ages[age].push(currentAge)
				}
			}
		}
	}
//	console.log(ages)

	var specialAges = [20,30, 40, 50, 60, 89]
	//var ages = ["20","30","40","50","60", "89"]
	var h = 20
	var w = 1100
	var ageScale = d3.scale.linear()
	.domain([20,100])
	.range([60,w-20])
	
	var ageLabels = d3.select("body #top-nav")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.append("g")
	.attr("class", "ageNav")
	
	ageLabels.selectAll("text")
	.data(ages)
	.enter()
	.append("text")
	.text(function(d,i){
		return d})
	.attr("y", 20)
	.attr("x", function(d,i){
		if(!isNaN(d)){
		return ageScale(d)
	}
	})
	.attr("opacity",0)
	.transition()
	.duration(duration)
	.delay(function(d, i) { return i / 2 * delay; })
	.style("opacity",function(d,i){
		if(specialAges.indexOf(d) > -1){
			//console.log(d)
			return 1
		}else{
			return .3
		}
	})
	
	ageLabels.selectAll("text")
	.on("mouseover", function(d,i){
		d3.select(this).style("opacity", 1)
	})
	.on("mouseout", function(d,i){
		d3.select(this).style("opacity",function(d,i){
			if(specialAges.indexOf(d) > -1){
			//console.log(d)
			return 1
		}else{
			return .3
		}})
	})
	.on("click", function(d,i){
		var filteredData = filterData("All",d, "All")
		var newTable = ageText(filteredData)
		var totalArtists = artists.length
		var percentage = d3.round(filteredData.length/totalArtists*100)
		if(percentage<1){
			percentage = "less than 1"
		}
		if(filterData("All",d, "All").length==1){
		d3.select("#detailsTitle").html("<span style = \"font-size:16px\">There was only "+filterData("All",d, "All").length+" artist aged "+d+"</span><br/>")
		d3.select("#details").html(newTable)
		}else{
		d3.select("#detailsTitle").html("<span style = \"font-size:16px\">"+filterData("All",d, "All").length+" or "+percentage+"% artists were aged "+d+"</span><br/>")
		d3.select("#details").html(newTable)
		}
		
		d3.selectAll(".dot-calendar circle").attr("class", "").style("fill", "black").style("stroke", "none")
		d3.selectAll("#main-nav *").remove()
		drawYears(100,10)
		if(mapShown == true){
			d3.selectAll("#arcs svg").attr("opacity", 1).transition().duration(1000).attr("opacity", 0)
//			d3.selectAll("#main-viz svg").remove()
			d3.selectAll("#arcs svg").remove()
			//drawMap(mapTally(filteredData))
			SHOULD_DRAW_MAPS = true
			drawDataMap(filteredData, 500, "#eee", "#222")
			SHOULD_DRAW_MAPS = false
		}else{
			SHOULD_DRAW_MAPS = false
			//dotCalendarDraw(dotCalendarTally(artists))
		}
		d3.selectAll("#skipAnimation").remove()
	})
}

function mapTally(targetCountryStatusSector){
	//tally by country
	var byCountry = {}
	for(visa in targetCountryStatusSector){
		var currentCountry = targetCountryStatusSector[visa]["birthplace state"]
		if(byCountry[currentCountry]==undefined){
			byCountry[currentCountry]=[]
			byCountry[currentCountry].push(targetCountryStatusSector[visa])
		}else{
			byCountry[currentCountry].push(targetCountryStatusSector[visa])
		}
	}
	//console.log(byCountry)
	var mapStats=[]
	for(country in byCountry){
		var currentCountry = byCountry[country]
		mapStats.push([country.toLowerCase(), byCountry[country].length])
		//console.log(country.toLowerCase(), byCountry[country].length)
	}
	return mapStats
}

//old choropleth map, not in use
function drawMap(dataset){
	//console.log("map")
	var width = 1100;
	var height = 600;
	var mpa = d3.map();
	var projection = d3.geo.times()
		.scale(200)
		.translate([width/2-80, height/2]);
	var path = d3.geo.path()
		.projection(projection);
	var map = d3.select("body #main-viz")
		.append("svg:svg")
		.attr("class", "map")
		.attr("width", width)
		.attr("height", height)
		.append("svg:g")
		
		d3.json("required/world_filtered.geojson", function(json){
			var mapValues = []
			for(var i = 0; i < dataset.length; i++){
				var dataCountry = dataset[i][0].toLowerCase();
				var dataValue = dataset[i][1];
				mapValues.push(dataValue);
				for(var j = 0; j < json.features.length; j++){
					var jsonCountry = json.features[j].properties.name.toLowerCase();
					if(dataCountry.toLowerCase() == jsonCountry.toLowerCase()){
						json.features[j].properties.value = dataValue;
						break;
					}				
				}
			}
			//console.log(json.features)
var maxColor = "black"
var color = d3.scale.sqrt().range(["#fff", maxColor])	
	color.domain([0,d3.max(mapValues)])
	map.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		//.style("stroke", "#fff")
		.style("fill", function(d){
			var value = d.properties.value;
			if(d.properties.name == "United States"){
				return "#fff"
			}
			if(value){
				return color(value);
			}else{
				return "#fff";
			}
		})
		.transition()
		.duration(2000)
		.attr("opacity",1)
	
	map.selectAll("path")
	.on("click", function(d,i){
		var Country = json.features[i].properties.name
		//console.log(Country)
		var filteredData = filterData("All", "All", Country)
		//console.log(filteredData)
		var newTable = buildTable(filteredData)
		d3.select("#details").html(newTable)
	})
	})
}


//functions for text formatting
function buildNameList(o){
	var returnString = ""
	for(i in o){
		var artistname = titleCase(o[i]["name"])
		//console.log(artistname)
		returnString = returnString +" "+ artistname
	}
	return returnString
}

	function ageText(data){
		var ageText = ""
		for(i in data) {
		var wikiPage = data[i]["wikipedia"]
		if(wikiPage == "yes"){
		var artistname = wikiCase(data[i]["name"])
		}else{
			var artistname = titleCase(data[i]["name"])
		}
		var birthplaceCity = titleCase(data[i]["birthplace city"])
		var birthplaceState = titleCase(data[i]["birthplace state"])
		var workplaceCity = titleCase(data[i]["work place city"])
		var workplaceState = titleCase(data[i]["work place state"])
		var birthYear = titleCase(data[i]["birthyear"])
		var age = titleCase(data[i]["age at the time"])
		var biennialYear = titleCase(data[i]["year of exhibition"])
		ageText = ageText +biennialYear+": "+artistname+" born in "+birthplaceState+" lives and works in "+ workplaceState+"</br>"
		}
		return ageText
	}

	function yearText(data){
		var ageArray = []
		for(i in data) {
			var wikiPage = data[i]["wikipedia"]
			if(wikiPage == "yes"){
			var artistname = wikiCase(data[i]["name"])
			}else{
				var artistname = titleCase(data[i]["name"])
			}
		ageArray.push([artistname])
		}
		return(ageArray)
	}
	
	function dotText(data){
		var dotText = ""
		for(i in data) {
			var wikiPage = data[i]["wikipedia"]
			if(wikiPage == "yes"){
			var artistname = wikiCase(data[i]["name"])
			}else{
				var artistname = titleCase(data[i]["name"])
			}
		var birthplaceCity = titleCase(data[i]["birthplace city"])
		var birthplaceState = titleCase(data[i]["birthplace state"])
		var workplaceCity = titleCase(data[i]["work place city"])
		var workplaceState = titleCase(data[i]["work place state"])
		var birthYear = titleCase(data[i]["birthyear"])
		var age = titleCase(data[i]["age at the time"])
		dotText = dotText + artistname+" born in "+birthplaceState+" lives and works in "+ workplaceState+"</br>"
		}
		return dotText
	}


function buildTable(o) {
var returnString = ""
var output = []

for(i in o) {
	var currentString = ""
var artistname = wikiCase(o[i]["name"])
var birthplaceCity = titleCase(o[i]["birthplace city"])
var birthplaceState = titleCase(o[i]["birthplace state"])
var workplaceCity = titleCase(o[i]["work place city"])
var workplaceState = titleCase(o[i]["work place state"])
var birthYear = titleCase(o[i]["birthyear"])
var age = titleCase(o[i]["age at the time"])
var biennialYear = titleCase(o[i]["year of exhibition"])

output.push([artistname, birthplaceCity, birthplaceState, workplaceState])

if(birthplaceCity == workplaceCity && birthplaceState == workplaceState){
	currentString =artistname+" was born in and works in "+birthplaceCity+", "+birthplaceState+"<br/>"
}
else{
	currentString ="<a href=\"http://en.wikipedia.org/wiki/List_of_recent_Whitney_Biennial_artists#"+biennialYear+"\"  target=\"_blank\">"+biennialYear+"</a> : "+ artistname+" born in "+birthplaceState + ", lives and works in "+workplaceState+"<br/>"
}
returnString = returnString +currentString
}
return returnString
}


function wikiCase(input){
	var artistName = titleCase(input)
	var output = ""
	input = input.split(' ')
	for(var c = 0; c < input.length; c++){
		output += input[c].substring(0,1).toUpperCase() + input[c].substring(1,input[c].length) + '_';
	}	
	output = "<a href=\"https://en.wikipedia.org/wiki/"+output.substring(0, output.length-1)+"\"  target=\"_blank\"> "+artistName+" </a>"
	return output
}

function titleCase(input) {
	var output = ""
	input = input.toLowerCase().split(' ')
	for(var c = 0; c < input.length; c++){
		output += input[c].substring(0,1).toUpperCase() + input[c].substring(1,input[c].length) + ' ';
	}
	return output.trim()
}

//ESSAY BOX DO NOT CHANGE = from WESAM's template
var essayBoxShown = false;
 $('#showMore').click(function(e){
     e.preventDefault();
     essayBoxShown = !essayBoxShown;
     if (essayBoxShown) {
         $('#essayBox').css('display', 'block');
         $('#essayBox').animate({'opacity':1.0}, 500);
         $(this).text(' Back to Visualization ');
 	//	d3.select("#detailsTitle").html("")
 		//d3.select("#details").html("")
		//d3.select("#skipAnimation").remove()
     } else {
         closeEssayBox();
         $(this).text(' About ');
     }
   })
   $('#essayBox-close').click(function(){
//	   console.log("close")
     closeEssayBox();
     $('#showMore').text(' About ');
   });


  function closeEssayBox(){
   $('#essayBox').animate({'opacity':0.0}, 500, function () {
     $('#essayBox').css('display', 'none');
   })
   essayBoxShown = false;
 }
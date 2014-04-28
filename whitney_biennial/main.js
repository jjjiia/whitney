function test(){
	console.log("connected to js")
}

test()
var mapShown = true

var artists = []
var csv = "DataSoFar_04262014_trimed2.csv"
d3.csv(csv, function(data){
	
	for(artist in data){
		artists.push(data[artist])
	}
	console.log(artists)
	drawYears()
	drawAges(artists)
	var calendarTallyData = dotCalendarTally(artists)
	//console.log(calendarTallyData)	
	//dotCalendarDraw(calendarTallyData)
	var mapData = mapTally(filterData("All","All", "All"))
	buildAgeDict(artists)
//	drawMap(mapData)
		
	d3.selectAll(".menu-calendar")
	.on("click", function(){
		d3.selectAll("#main-viz svg").attr("opacity", 1).transition().duration(1000).attr("opacity", 0)
		
		d3.selectAll("#main-viz svg").remove()
		dotCalendarDraw(calendarTallyData)
		mapShown = false
		console.log(mapShown)
	})
	
	d3.selectAll(".menu-map")
	.on("click", function(){
		d3.selectAll("#main-viz svg").attr("opacity", 1).transition().duration(1000).attr("opacity", 0)
		
		d3.selectAll("#main-viz svg").remove()
		drawMap(mapData)
		mapShown = true
	})
	
	
	setTimeout(function(){drawDataMap(filterData("All","All", "All"), 1000, "#eee", "#222")},0)

	//setTimeout(function(){d3.selectAll("#main-viz svg").remove()},10000);
	//setTimeout(drawDataMap(data),30000);
})


function drawDataMap(data, speed, fill, stroke){
	console.log("datamap")
    var map = new Datamap({
      scope: 'world',
      element: document.getElementById('main-viz'),
      projection: 'mercator',
		bubblesConfig: {
		        borderWidth: 0,
				borderColor: 'red',
				},
		geographyConfig: {
		    popupOnHover: false,
		    highlightOnHover: false,
			borderWidth: .2,
			//borderColor: '#000',
			fillOpacity: 0.02
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
		var colors = ["#222", "#888", "#666", "#888"]

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
		//separate by years
		var currentYear = artists[artist]["year of exhibition"]
		var currentAge = artists[artist]["age at the time"]
		//console.log(currentYear, currentAge)
		if(byYear[currentYear] != undefined){
			if (byYear[currentYear][currentAge]==undefined){
				byYear[currentYear][currentAge]=[]
				byYear[currentYear][currentAge].push(artists[artist])
			}else{
				byYear[currentYear][currentAge].push(artists[artist])
			}
		}
		//console.log(currentYear, currentAge, byYear[currentYear][currentAge].length,byYear[currentYear][currentAge])
	}
	//console.log(byYear)
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
		//console.log(year,sum)
	}
	
	//console.log(d3.max(lengthOnly))
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
	
	var dotCalendar = d3.select("body #main-viz")
	.append("svg")
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
		//console.log(d[2])
		return rScale(d[2])
	})
	.attr("opacity", function(d){
		return 1
	})
	.attr("fill", "black");
	
	dotCalendar.selectAll("circle").on("mouseover", function(d){
//		if(parseInt(d[2])== 1){
//			d3.select("#details").html("In "+d[0]+ ", there was "+d[2]+" Artists Aged "+d[1]+". Click on Circle for Details")
//			
//		}else{
//			d3.select("#details").html("In "+d[0]+ ", there were "+d[2]+" Artists Aged "+d[1]+". Click on Circle for Details")
//		}
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
		var newTable = buildTable(d[3])
		//console.log(newTable)
		if(parseInt(d[2])==1){
			d3.select("#details").html("<span style = \"font-size:16px\">In "+d[0]+ ", there was "+d[2]+" artist aged "+d[1]+":</span><br/>"+d[4]+"% of all "+d[0]+" artists, and "+d[5]+"% of all "+d[1]+" year old artists<br/><br/>"+newTable)
		}else{
			d3.select("#details").html("<span style = \"font-size:16px\">In "+d[0]+ ", there were "+d[2]+" artists aged "+d[1]+":</span><br/>"+d[4]+"% of all "+d[0]+" artists, and "+d[5]+"% of all "+d[1]+" year old artists<br/><br/>"+newTable)
		}
	})
}

function drawYears(){
	//console.log("years")
	var years = ["1973", "1975", "1977", "1979", "1981", "1983", "1985", "1987", "1989", "1991", "1993", "1995", "1997", "2000", "2002", "2004", "2006", "2008", "2010", "2012", "2014"]
	var h =500
	var w = 50
	var yearScale = d3.scale.linear()
	.domain([1973,2014])
	.range([20,h-20])
	
	var yearlabels = d3.select("body #main-nav")
	.append("svg")
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
		return yearScale(d)+10
	})
	.attr("x", function(d,i){
		return 0
	})
	.attr("opacity",0)
	.transition()
	.duration(1000)
	.delay(function(d, i) { return i / 2 * 260; })
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
		var newTable = buildTable(filteredData)
		d3.select("#details").html("<span style = \"font-size:16px\">There were "+filterData(d,"All", "All").length+" artists in the "+d+" Biennial</span><br/>"+newTable)
		d3.selectAll(".dot-calendar circle").attr("class", "").style("fill", "black").style("stroke", "none")

		if(mapShown == true){
			d3.selectAll("#main-viz svg").attr("opacity", 1).transition().duration(1000).attr("opacity", 0)
			d3.selectAll("#main-viz svg").remove()
			//drawMap(mapTally(filteredData))
			drawDataMap(filteredData, 1000, "#eee", "#222")
		}
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
	//var ageDict = []
//	for (age in ages){
//		ageDict.push([ages[age], ages[age].length])
//	}
	//console.log(ageDict)
//	return ageDict
return ages
}

function drawAges(dataset){
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
			if(ages[age]==undefined){
				ages[age]=[]
				ages[age].push(currentAge)
			}else{
				ages[age].push(currentAge)
			}
		}
	}
//	var ageDict = []
//	for(age in ages){
//		ageDict.push(ages[age][0], ages[age].length)
//	}
//	console.log(ageDict)
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
	.duration(5000)
	.delay(function(d, i) { return i / 2 * 20; })
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
		var newTable = buildTable(filteredData)
		var totalArtists = artists.length
		var percentage = d3.round(filteredData.length/totalArtists*100)
		if(filterData("All",d, "All").length==1){
		d3.select("#details").html("<span style = \"font-size:16px\">There was only "+filterData("All",d, "All").length+" artist aged "+d+"</span><br/>"+newTable)
		}else{
		d3.select("#details").html("<span style = \"font-size:16px\">"+filterData("All",d, "All").length+" or "+percentage+"% artists were aged "+d+"</span><br/>"+newTable)
		}
		d3.selectAll(".dot-calendar circle").attr("class", "").style("fill", "black").style("stroke", "none")

		if(mapShown == true){
			d3.selectAll("#main-viz svg").attr("opacity", 1).transition().duration(1000).attr("opacity", 0)
			
			d3.selectAll("#main-viz svg").remove()
			//drawMap(mapTally(filteredData))
			drawDataMap(filteredData, 1000, "#eee", "#222")
		}
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

function drawMap(dataset){
	console.log("map")
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
//		.attr("opacity", 0)
		.transition()
		.duration(2000)
		.attr("opacity",1)
	
	map.selectAll("path")
	.on("click", function(d,i){
		var Country = json.features[i].properties.name
		console.log(Country)
		var filteredData = filterData("All", "All", Country)
		console.log(filteredData)
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

function buildTable(o) {
var table = $("<table/>")
var returnString = ""
for(i in o) {
	var currentString = ""
var artistname = titleCase(o[i]["name"])
var birthplaceCity = titleCase(o[i]["birthplace city"])
var birthplaceState = titleCase(o[i]["birthplace state"])
var workplaceCity = titleCase(o[i]["work place city"])
var workplaceState = titleCase(o[i]["work place state"])
var birthYear = titleCase(o[i]["birthyear"])
var age = titleCase(o[i]["age at the time"])
var biennialYear = titleCase(o[i]["year of exhibition"])
if(birthplaceCity == workplaceCity && birthplaceState == workplaceState){
	currentString =artistname+" was born in and works in "+birthplaceCity+", "+birthplaceState+"<br/>"
}
else{
	currentString =biennialYear+": "+ artistname+" born "+birthYear+", age:"+age+", "+birthplaceState + " lives and works in "+ workplaceCity+", "+workplaceState+"<br/>"
}
returnString = returnString +currentString
}
return returnString
}


function titleCase(input) {
	var output = ""

	input = input.toLowerCase().split(' ')

	for(var c = 0; c < input.length; c++){
		output += input[c].substring(0,1).toUpperCase() + input[c].substring(1,input[c].length) + ' ';
	}

	return output.trim()
}
function test(){
	console.log("test")
}

test()

var artists = []
var csv = "DataSoFar_04252014.csv"
d3.csv(csv, function(data){
	
	for(artist in data){
		artists.push(data[artist])
	}
	//console.log(artists)
	
	var calendarTallyData = dotCalendarTally(artists)
	//console.log(calendarTallyData)	
	dotCalendarDraw(calendarTallyData)
})

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
		return rScale(d[4])
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
drawYears()
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
	.style("opacity", .3)
	.on("mouseover",function(d,i){
		d3.select(this).style("opacity", 1)
	})
	.on("mouseout",function(d,i){
		d3.select(this).style("opacity", .3)
	})
	.on("click", function(d,i){
		//console.log(filterData(d,"All", "All").length)
		console.log(filterData(d,"All", "All"))
		var newTable = buildTable(filterData(d,"All", "All"))
		d3.select("#details").html("<span style = \"font-size:16px\">There were "+filterData(d,"All", "All").length+" artists in the "+d+" Biennial</span><br/>"+newTable)
		d3.selectAll(".dot-calendar circle").attr("class", "").style("fill", "black").style("stroke", "none")
		
	})
	
	yearlabels.selectAll("text").attr("opacity", 0)
	.transition()
	.duration(1000)
	.attr("opacity",1)
	
}
drawAges()
function drawAges(){
	//console.log("ages")
	//build age array
	var ages = []
	for(var age = 20; age < 90; age++){
		ages.push(age)
	}
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
	.text(function(d){
		return d})
	.attr("y", 20)
	.attr("x", function(d,i){
		return ageScale(d)
	})
	.style("opacity",function(d,i){
		if(specialAges.indexOf(d) > -1){
			console.log(d)
			return 1
		}else{
			return .3
		}
	})
	.on("mouseover", function(d,i){
		d3.select(this).style("opacity", 1)
	})
	.on("mouseout", function(d,i){
		d3.select(this).style("opacity",function(d,i){
			if(specialAges.indexOf(d) > -1){
			console.log(d)
			return 1
		}else{
			return .3
		}})
	})
	.on("click", function(d,i){
		console.log(filterData("All",d, "All"))
		var newTable = buildTable(filterData("All",d, "All"))
		if(filterData("All",d, "All").length==1){
		d3.select("#details").html("<span style = \"font-size:16px\">There was only "+filterData("All",d, "All").length+" artist aged "+d+" between 1973 - 2014</span><br/>"+newTable)
		}else{
		d3.select("#details").html("<span style = \"font-size:16px\">There were "+filterData("All",d, "All").length+" artists aged "+d+" between 1973 - 2014</span><br/>"+newTable)
		}
		d3.selectAll(".dot-calendar circle").attr("class", "").style("fill", "black").style("stroke", "none")
		
	})
}

function buildNameList(o){
	var returnString = ""
	for(i in o){
		var artistname = titleCase(o[i]["name"])
	}
	returnString = returnString+ artistname
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

if(birthplaceCity == workplaceCity && birthplaceState == workplaceState){
	currentString =artistname+" was born in and works in "+birthplaceCity+", "+birthplaceState+"<br/>"
}
else{
	currentString = artistname+" was born in "+birthplaceCity+", "+birthplaceState + " and works in "+ workplaceCity+", "+workplaceState+"<br/>"
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
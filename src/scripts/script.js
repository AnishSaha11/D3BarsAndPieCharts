
var data = null;
var firstLoad=true;
var numBins =12;
var curVar;
var barPieToggle = 1;
function readAndStart(){

	d3.csv("/data/movies.csv",function(rawData){
		console.log(Object.keys(rawData[0]));
		data = rawData;
		onLoad();
		});
}
function onLoad(){
	d3.select("#menu").style("display","none");
	console.log(data.length+" rows read")
	var columns = Object.keys(data[0]);
	
	d3.selectAll("#options").remove();
	d3.selectAll("svg").remove();

	console.log("Selected columns: "+ curVar);
	
	//}

	var toAdd = document.createDocumentFragment();
	for (var i = 0;i<columns.length;i++){
		var newLabel = document.createElement('div');
		newLabel.innerHTML = columns[i];
		newLabel.id = "options";
		toAdd.appendChild(newLabel);
	}
	document.getElementById("menu").append(toAdd);
	d3.selectAll("#options").style("color","#f2f2f2")
		.style("font-size","11px")
		.attr("width","100%")
		.style("margin-top","5px")
		.style("text-align","center")
		.style("margin-bottom","5px")
		.style("font-family","Verdana")
		.style("font-weight","200")
		.on("mouseover",onButton)
		.on("mouseout",offButton)
		.on("click",function(){
			console.log(this.innerHTML);
			curVar = this.innerHTML;
			onLoad();
			return;
		})
		;
	function onButton(){
		d3.select(this).style("background-color","black")
			.style("opacity","1");
	}
	function offButton(){
		d3.select(this).style("background-color","#1a1a1a")
			.style("opacity",".95");
	}
	var chartType;
	if(barPieToggle == 1){
		chartType="Y-axis";
		document.getElementById("headLabel").innerHTML = "Bar Graph";
	}
	else{
		chartType="Pie Chart";
		document.getElementById("headLabel").innerHTML = "Pie Chart";
	}
	if (firstLoad == true){
		document.getElementById("varName").innerHTML = "Choose a variable to plot";
		firstLoad=false;
	}else{
		document.getElementById("varName").innerHTML = "Plotting "+curVar;
		document.getElementById("plotDesc").innerHTML = "Distribution of "+curVar+" is plotted on the "+chartType;
	var datasetArray=[];
	for (var i=0;i<data.length;i++){
		var value = parseInt(data[i][""+curVar+""]);
		if ((value == null || isNaN(value) || value<0)==false)
			datasetArray.push(value);
		//console.log(data[i][""+this.innerHTML+""]);
	}
	//var dataset = [100,200,70,150,190];
	console.log("final size: "+datasetArray.length);
	console.log(datasetArray);
	
	console.log("Number of Bins: "+numBins);
	var dataset = [];
	for (var c=0;c<numBins;c++)
		dataset.push(0);
	console.log("Intialized to: "+dataset);
	for (var i =0;i<datasetArray.length;i++){
		if (datasetArray[i]==d3.max(datasetArray)){
			dataset[numBins-1]+=1;
			continue;
		}
		var bin = (datasetArray[i]-d3.min(datasetArray))*numBins/(d3.max(datasetArray)-d3.min(datasetArray));
		if(Math.floor(bin)>numBins)
			console.log("index: "+i+" Chosen bin: " +Math.floor(bin)+ " for value "+datasetArray[i]);
		//console.log("Setting bin: "+bin+" count to "+dataset[Math.floor(bin)]+1);
		dataset[Math.floor(bin)]+=1;
		
	}
	console.log("Max value is: "+d3.max(datasetArray));
	console.log("Min value is: "+d3.min(datasetArray));
	console.log(dataset.length);
	console.log("Final hist data: "+dataset);
	d3.select("#binValue")
		.text("Number of Bins: "+numBins);
	if (firstLoad==false){
		var textContent=document.getElementById("plotDesc").innerHTML;
		textContent+="</br></br></br>Maximum Value is: "+d3.max(datasetArray);
		textContent+="</br>Minimum Value is: "+d3.min(datasetArray);
		textContent+="</br></br>Maximum frequency is: "+d3.max(dataset);
		textContent+="</br>Minimum frequency is: "+d3.min(dataset);
		
		document.getElementById("plotDesc").innerHTML=textContent;
		
	}

	var SVGContainerWidth = 580;
	var SVGContainerHeight = 350;
	if (barPieToggle==1){
		var graphHeight = 300;
		var graphWidth = 530
		var barWidth = (graphWidth)/numBins;
		var normHeight = graphHeight/d3.max(dataset);
		var barPadding = 1;
		var svg = d3.select("#graphHolder")
			.append("svg")
			.attr("width",SVGContainerWidth)
			.attr("height",SVGContainerHeight)
			.on("click",function(){
				if (barPieToggle == 1)
					barPieToggle=0;
				else
					barPieToggle=1;
				//alert("barPieToggle: "+barPieToggle);
				onLoad();
			});
			
		var barChart = svg.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("y",function(d){
				//console.log("Y is: "+graphHeight-(d*normHeight)+(SVGContainerHeight-graphHeight)/2);
				return graphHeight-(d*normHeight)+(SVGContainerHeight-graphHeight)/2;})
			.attr("x",(SVGContainerWidth-graphWidth)/2+barPadding/2)
			.attr("height",function(d){return d*normHeight;})
			.on("mouseover",onHover)
			.on("mouseout",onOut)
			.attr("width",barWidth - barPadding)
			.style("fill","#004d80")
			.attr("transform",function(d,i){
				var translate = [barWidth*i,0];
				return "translate("+ translate +")";
			})
		

		var yscale = d3.scaleLinear()
			.domain([d3.max(dataset),0])
			.range([(SVGContainerHeight-graphHeight)/2,graphHeight+(SVGContainerHeight-graphHeight)/2]);
		var xscale = d3.scaleLinear()
			.domain([d3.min(datasetArray),d3.max(datasetArray)])
			.range([(SVGContainerWidth-graphWidth)/2,graphWidth+(SVGContainerWidth-graphWidth)/2]);
		var x_axis = d3.axisBottom().scale(xscale);
		var y_axis = d3.axisLeft().scale(yscale);
		svg.append("g")
			.attr("transform","translate("+(SVGContainerHeight-graphHeight)/2+",0)")
			.call(y_axis);
		svg.append("g")
			.attr("transform","translate(0,"+(graphHeight+(SVGContainerHeight-graphHeight)/2)+")")
			.call(x_axis);

		function onHover(d,i){
			d3.select(this).attr("y",graphHeight-(d*normHeight)+(SVGContainerHeight-graphHeight)/2-10)
				.attr("height",(d*normHeight)+(SVGContainerHeight-graphHeight)/2-14)
				.style("fill","#007acc");
				
			d3.select("svg").append("text")
				.text(d)
				.style("fill","#1a1a1a")
				.attr("x",i*barWidth + (SVGContainerWidth-graphWidth)/2+barPadding+barWidth/4)
				.style("font-size","15")
				.style("font-weight","bold")
				.attr("id","t"+i)
				.style("font-family","Verdana")
				.attr("y",graphHeight-(d*normHeight)+14);
				
		}
		function onOut(d,i){
			d3.select(this).attr("y",graphHeight-(d*normHeight)+(SVGContainerHeight-graphHeight)/2)
				.attr("height",d*normHeight)
				.style("fill","#004d80");
			d3.select("#t"+i).remove();
		
		}
	}
	else{
		console.log("ShowPie");
		pieChartHeight=320;
		pieChartWidth=320;
		var svg = d3.select("#graphHolder")
			.append("svg")
			.attr("width",SVGContainerWidth)
			.attr("height",SVGContainerHeight)
			.attr("align","center")
			.on("click",function(){
				if (barPieToggle == 1)
					barPieToggle=0;
				else
					barPieToggle=1;
				//alert("barPieToggle: "+barPieToggle);
				onLoad();
			});
		var radius = 150;
		var color = d3.scaleOrdinal(d3.schemeCategory10);
		var g = svg.append('g')
				   .attr('transform', 'translate(' + (radius+(SVGContainerWidth-pieChartWidth)/2) + ',' + (radius+(SVGContainerHeight-300)/2) + ')');

		var arc = d3.arc()
					.innerRadius(0)
					.outerRadius(radius);

		var pie = d3.pie()
					.value(function(d) { console.log(d);return d; })
					.sort(null);

		var path = g.selectAll('path')
					.data(pie(dataset))
					.enter()
					.append("g")  
					.append('path')
					.attr('d', arc)
					.attr('fill', (d,i) => color(i))
					.style('opacity', 0.8)
					.style('stroke', 'white')
					.on("mouseover", function(d,i) {
				      d3.select(this).style("opacity", 1);
				 	  let g = d3.selectAll("svg");
				        				      
				      let arc = d3.arc()
								.innerRadius(0)
								.outerRadius(radius+10);
					  d3.select(this).attr('d',arc);
					  console.log(g);
					  pointer_pos = d3.mouse(this);
					  //console.log(pointer_pos);
					  pointer_x = pointer_pos[0];
					  pointer_y = pointer_pos[1];
					  
					  var bucketEnd = (i+1)*(d3.max(datasetArray)-d3.min(datasetArray))/numBins;
					  //console.log(bucketEnd);
					  var bucketStart = bucketEnd - (d3.max(datasetArray)-d3.min(datasetArray))/numBins;
					  //console.log(bucketStart);
					  g.append("text")
					  	.text(d3.format(".2f")(bucketStart)+" - " + d3.format(".2f")(bucketEnd))
				        .attr("fill","#1a1a1a")
				        .style("font-size","16")
				        .style("font-family","Verdana")
				        .style("font-weight","bold")
				        .attr("text-anchor", "middle")
				        .attr('transform', 'translate(500,'+ 2*radius+')');

				      g.append("text")
					  	.text("Bucket Range")
				        .attr("fill","#1a1a1a")
				        .style("font-size","16")
				        .style("font-family","Verdana")
				        .style("font-weight","bold")
				        .attr("text-anchor", "middle")
				        .attr('transform', 'translate(500,'+ (2*radius - 20)+')');

				      g.append("text")
				        .attr("class", "name-text")
				        .attr("id","pie-label")
				        .text(d.data+" ("+d3.format(".2f")((d.data*100)/datasetArray.length)+") %")
				        .attr("fill","#1a1a1a")
				        .style("font-size","16")
				        .style("font-family","Verdana")
				        .style("font-weight","bold")
				        .attr("text-anchor", "middle")
				        .attr('transform', 'translate(' + (radius+(SVGContainerWidth-pieChartWidth)/2+pointer_x-20)+ ',' 
				        	+ (radius+(SVGContainerHeight-300)/2+pointer_y-10)+ ')');
    				})
    				.on("mouseout",function(d){
    					d3.select(this) .style("opacity", 0.8);
    					let arc = d3.arc()
								.innerRadius(0)
								.outerRadius(radius);
					  	d3.select(this).attr('d',arc);
					  	d3.selectAll("text").remove();
    				})
    				.on("mousemove",function(d){
    					pointer_pos = d3.mouse(this);
						//console.log(pointer_pos);
						pointer_x = pointer_pos[0];
						pointer_y = pointer_pos[1];
    					d3.select("#pie-label").attr("transform",'translate(' + (radius+(SVGContainerWidth-pieChartWidth)/2+pointer_x-20)+ ',' 
				        	+ (radius+(SVGContainerHeight-300)/2+pointer_y-20)+ ')');
    				});


	}
}

}
var menuToggle = 0;
function showMenu(){
	if (menuToggle == 0){
		document.getElementById("menu").style.display = "inline";
		menuToggle=1;
	}
	else{
		document.getElementById("menu").style.display = "none";
		menuToggle=0;
	}
	
}
function adjust(){
	console.log("Bin value set to: " +document.getElementById("rangeSlider").value);
	numBins = document.getElementById("rangeSlider").value;
	onLoad();
}

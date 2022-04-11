function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//NOTE: added sections computing variables for the 'gauge' component in the bar graph section***.
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //as per instructions - adding console log for debugging***.
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samples=data.samples;
    var metadataElements=data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredArray = samples.filter(sampleElement => sampleElement.id == sample);
    var filteredmetaData = metadataElements.filter(sampleElement => sampleElement.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    //NOTE: COmbinnig the filtdered meta data elements here as well***.
    var result = filteredArray[0];
    var metadataResult = filteredmetaData[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    //NOTE: this is for the gauge portion - adding wash freq data:
    //NOTE: applying parse float function to metadata results on washer element*. 
    var washingFreq = parseFloat(metadataResult.wfreq);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //NOTE: here you are creating a sliced version of the data and mapping the values out while concatenating OTU with OTU ID Values***.
    //NOTE: Chain SLICE to MAP and Reverse***.
    var yticks = otu_ids.slice(0, 10).reverse().map(otu_ids => "OTU " + otu_ids);

    // 8. Create the trace for the bar chart. 
    //NOTE: applying same reverse and slice functions to the sample values as to ytick values***.
    var barData = [{

        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        text: otu_labels,
        type: 'bar',
        orientation: 'h',
    }
    ];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU IDS"},
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout);

    //NOTE Instructions indicate to copy lines in buble charts into aggregated 'charts' js file***.
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      type: "bubble",
      text: otu_labels,
      colorscale: "YlOrRd",
      marker: {
        size: sample_values,
        color: otu_ids
        }
    }
    ];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU IDS"},     
      hovermode: "closest",
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    //GAUGE SECTION****
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      value: washingFreq,
      gauge: {
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" }]
      },
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {text: "Belly BUtton Washing Frequency" }     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout)
    });
  }









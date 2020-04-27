function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    var FilteredArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var Filtered = FilteredArray[0];
    
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

   
    Object.entries(filtered).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

/****************************************************************************** */
function buildPlots(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var FilteredArray = samples.filter(sampleObj => sampleObj.id == sample);
    var Filtered = FilteredArray[0];

    var otu_ids = Filtered.otu_ids;
    var otu_labels = Filtered.otu_labels;
    var sample_values = Filtered.sample_values;

  
    var bubbleformat = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var bubbledata = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    /***************************************************************************************/

    Plotly.newPlot("bubble", bubbledata, bubbleformat);

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

/*******************************************************************/
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    var firstSample = sampleNames[0];
    buildPlots(firstSample);
    buildMetadata(firstSample);
  });
}

/******************************************************************************/

function optionChanged(newSample) {
  buildPlots(newSample);
  buildMetadata(newSample);
}

init();

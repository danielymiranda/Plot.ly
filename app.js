
// Initiate a global variable of `data`
var data;

// 1. Use the D3 library to read in `samples.json`.
// Fetch the JSON data and console log it
function jsonLoad() {
    d3.json("static/js/data/samples.json").then(jFirst => {
      data = jFirst;
      var selVals = jFirst.names;
      console.log(data);
  
      var selOpts = d3.select("#selDataset");
  
      selVals.forEach(value => {
        selOpts
          .append("option")
          .text(value)
          .attr("value", function() {
            return value;
          });
      });
    });
  };

// Call the jsonLoad function to load the data
jsonLoad();



// This function is called when a dropdown menu item is selected
function optionChanged() {
  // Prevent the page from refreshing
  d3.event.preventDefault();
  // Use D3 to select the dropdown menu and assign the value of the dropdown menu option to a variable
  var idChoice = d3.select("#selDataset").node().value;
  // Build the plots with the new id variable
  bellyPlots(idChoice);
};


function bellyPlots(idChoice) {
    barSlice(idChoice);
    demoInfo(idChoice);
    bubblePlot(idChoice);
    gaugePlot(idChoice);
    };

function barSlice(idChoice) {
    var filterID1 = data.samples.filter(bactIDs => bactIDs.id == idChoice);
    var ouid = filterID1.map(v => v.otuids);
        ouid = ouidExtract(ouid[0].slice(0, 10));
    var seqRead = filterID1.map(v => v.sample_values);
        seqRead = seqRead[0].slice(0, 10);

    var otuClass = filterID1.map(v => v.otu_labels);
    var bacteriaNames = bacteriaName(otuClass[0]).slice(0, 10);

    var trace1 = {
        x: seqRead,
        y: ouid,
        text: bacteriaNames,
        type: "bar",
        orientation: "h"
    };

    var data = [trace1];

    var layout = {
        title: "Top Ten OTUs Found",
        xaxis: { title: "Count of Sequences Read"},
        yaxis: {
            autorange: "reversed", 
            title: "OTU ID"
        }
    };

    Plotly.newPlot("bar", data, layout);
};

function demoInfo(idChoice) {
    var filterDemo1 = data.metadata.filter(metaIDs => metaIDs.id == idChoice);

    var metaFill = d3.select(".panel-body");
    metaFill.html("");
    metaFill.append("p").text(`Subject ID #   : ${filterDemo1[0].id}`);
    metaFill.append("p").text(`Ethnicity      : ${filterDemo1[0].ethnicity}`);
    metaFill.append("p").text(`Gender (M/F)   : ${filterDemo1[0].gender}`);
    metaFill.append("p").text(`Age in Years   : ${filterDemo1[0].age}`);
    metaFill.append("p").text(`Home City/State: ${filterDemo1[0].location}`);
    metaFill.append("p").text(`Innie or Outtie: ${filterDemo1[0].bbtype}`);
    metaFill.append("p").text(`Washes / Week  : ${filterDemo1[0].wfreq}`);
};

function bubblePlot(idChoice) {
    var filterID2 = data.samples.filter(bactIDs => bactIDs.id == idChoice);
    var ouid = filterID2.map(v => v.otuids);
    ouid = ouidExtract(ouid[0]);
    var seqRead = filterID2.map(v => v.sample_values);
    seqRead = seqRead[0];

    var otuClass = filterID2.map(v => v.otu_labels);
        otuClass = bacteriaName(otuClass[0]);
    
    var trace2 = {
        x: ouid,
        y: seqRead,
        mode: "markers",
        marker: {
            color: ouid,
            size: seqRead
        },
        text: otuClass
    };
    
    var data2 = [trace2];
    
    var layout2 = {
        title: 'Bacteria Frequency of Sequences Read per Subject',
        showlegend: false,
        height: 600,
        width: 600
    };
    
    Plotly.newPlot("bubble", data2, layout2);
};

function gaugePlot(idChoice) {
    var filterDemo2 = data.metadata.filter(metaIDs => metaIDs.id == idChoice);
    var washWeek = filterDemo2[0].wfreq;

    var gaugeData = [
        {
        type: "indicator",
        mode: "gauge",
        value: washWeek,
        title: { text: "<strong>Navel Wash Frequency</strong><br>Scrubs per Week", font: { size: 24 } },
        gauge: {
            axis: { range: [1, 10],
                tickvals: [0,1,2,3,4,5,6,7,8,9,10],
                tickwidth: 1, 
                ticks: "outside",
                tickcolor: "darkblue"
                },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "#B3B3B3",
            steps: [
            { range: [0, 1], color: "#007676" },
            { range: [1, 2], color: "#00B3B3" },
            { range: [2, 3], color: "#00CCCC" },
            { range: [3, 4], color: "#00E6E6" },
            { range: [4, 5], color: "#00FFFF" },
            { range: [5, 6], color: "#00E6E6" },
            { range: [6, 7], color: "#1AFFFF" },
            { range: [7, 8], color: "#33FFFF" },
            { range: [8, 9], color: "#4DFFFF" },
            { range: [9, 10], color: "#76FFFF" }
            ],
            threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: washWeek
            }
        }
        }
    ];
    
    var gaugeLayout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
    };
    
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
};


// function to return the name of the bacteria.
// if a array value has more than one name, it will consider the last name of the value
// return just the 10 first values of the result
function bacteriaName(name) {
    var listOfBact = [];
  
    for (var i = 0; i < name.length; i++) {
      var stringName = name[i].toString();
      var splitValue = stringName.split(";");
      if (splitValue.length > 1) {
        listOfBact.push(splitValue[splitValue.length - 1]);
      } else {
        listOfBact.push(splitValue[0]);
      }
    }
    return listOfBact;
  };

function ouidExtract(name) {
    var ouidList = [];
    for (var i = 0; i < name.length; i++) {
        ouidList.push(`OTU ${name[i]}`);
    }
    return ouidList;
};

// event listener for change takes place to the dropdown menu
d3.selectAll("body").on("change", optionChanged);
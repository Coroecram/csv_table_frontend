'use strict'
window.onload = function () {
  if (typeof(window.Genesis) === "undefined") {
    window.Genesis = {};
  };

  var Table = Genesis.Table = {
    data: undefined,
    columns: [],
    columnInfo: [],
    columnTitles: [],
    rowNum: 1
  };

  Table.upload = function(e) {
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
        var csvData = event.target.result;

        var parsedCSV = Papa.parse(csvData, {'header': true, 'dynamicTyping': true});
        Table.data = parsedCSV.data;
        Table.headers = Object.keys(Table.data[0])
        var rowNumCol = {title:"Row Number",
         'field': "rownum",
         'mutator': function(value, data, type, params, component){
          //value - original value of the cell
          //data - the data for the row
          //type - the type of mutation occuring (data|edit)
          //params - the mutatorParams object from the column definition
          //component - when the "type" argument is "edit", this contains the cell component for the edited cell, otherwise it is the column component for the column

        return Table.rowNum++; //return the new value for the cell data.
      }};
        Table.columns = [rowNumCol];

        for (var i = 0; i < Table.headers.length; i++) {
          Table.columns.push({ 'title': toTitleCase(Table.headers[i]),
            'field': Table.headers[i],
            'sortable': true,
            'type': typeof(Table.data[0][Table.headers[i]])
          });
        };

        $("#csv-table").tabulator({'columns': Table.columns,
                                    'layout':"fitColumns",
                                    'addRowPos':"top",
                                    'pagination':"local",
                                    'paginationSize':7,
                                    'movableColumns':true,
                                    'resizableRows':true
                                  });
        $("#csv-table").tabulator("setData", Table.data.slice(0,-1));
        $("#filters").show();
        $("#add-filter").show();
    };

  }
}();

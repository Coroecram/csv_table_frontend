'use strict'

window.onload = function () {
  if (typeof(window.CSVTable) === "undefined") {
    window.CSVTable = {};
  };
  var Table = CSVTable.Table;

  var Filters = CSVTable.Filters = {
    TEXT_OPERATORS: ['=', '!=', '&lt;', '&gt;', '&lt;=', '&gt;=', 'IN', 'LIKE'],
    TEXT_OPERATOR_VALS: ['=', '!=', '&lt;', '&gt;', '&lt;=', '&gt;=', 'in', 'like'],
    NUM_OPERATORS: ['=', '!=', '&lt;', '&gt;', '&lt;=', '&gt;='],
    strOpSelector: ['<select id="filter-txt-op" class="filter-op filter-row-ele$', 'filter-op-0', '" >'],
    numOpSelector: ['<select id="filter-num-op" class="filter-op filter-row-ele$', 'filter-op-0', '" >'], // Need $ as spaceholder, join trims space
    filtersApplied: [],
    filterIdx: 0,
    filterDict: {},
    filters: []
  }

  for (var i = 0; i < Filters.TEXT_OPERATORS.length; i++) {
    Filters.strOpSelector.push('<option value="' + Filters.TEXT_OPERATOR_VALS[i] + '" >' + Filters.TEXT_OPERATORS[i] + '</option>')
  }

  for (var i = 0; i < Filters.NUM_OPERATORS.length; i++) {
    Filters.numOpSelector.push('<option value="' + Filters.NUM_OPERATORS[i] + '" >' + Filters.NUM_OPERATORS[i] + '</option>')
  }

  Filters.removeFilter = function(filter) {
      for(var i = 0; i < this.filters.length; i++) {
        if (this.filters[i].field == filter.field &
            this.filters[i].type  == filter.type &
            this.filters[i].value == filter.value) {
              this.filters.splice(i, 1);
        }
      }
    }.bind(Filters);

  Filters.pushFilter = function(filter, filterIdxClass) {
    var dupFilter = false;
    if (this.filterDict[filterIdxClass] && filter != this.filterDict[filterIdxClass]) { // Remove edited filter
      this.removeFilter(this.filterDict[filterIdxClass])
    }
    for(var i = 0; i < filters.length; i++) {
      if (this.filters[i].field == filter.field &
          this.filters[i].type  == filter.type &
          this.filters[i].value == filter.value) {
            dupFilter = true;
      }
    }

    if(dupFilter) {
      return false;
    } else {
      this.filters.push(filter);
      this.filterDict[filterIdxClass] = filter;
      return true;
    }
  }.bind(Filters);

  Filters.addFilter = function() {
    var filterRow = [];
    var newFilter = '';
    var filterIdxClass = 'filter-' + this.filterIdx;
    var filterColIdx = 'filter-col-' + this.filterIdx;
    var filterOpIdx = 'filter-op-' + this.filterIdx;
    var filterValIdx = 'filter-value-' + this.filterIdx;
    var filterConfirmIdx = 'filter-confirm-' + this.filterIdx;
    var filterRemoveIdx = 'filter-remove-' + this.filterIdx;
    var colType = Table.columns[0].type;
    console.log(Table.columns);
    var opSelector = this.makeOpSelector(colType, filterOpIdx)
    this.filterIdx++;

    filterRow.push('<li class="filter-row" id="' + filterIdxClass + '" >')
    filterRow.push("<div id='filter-selection' class='filter-row-ele'><select class='filter-col filter-row-ele " + filterColIdx + "' >")
    for (var i = 0; i < CSVTable.Table.columns.length; i++) {
      filterRow.push("<option value=" + CSVTable.Table.columns[i].field + ">" + CSVTable.Table.columns[i].title + "</option>")
    }
    filterRow.push("</select></div>");
    filterRow.push("<div id='filter-selection' class='filter-row-ele'>")
    filterRow.push(opSelector);
    filterRow.push("</select></div>");
    filterRow.push('<input class="filter-value filter-row-ele ' + filterValIdx + '" type="text"></input>');
    filterRow.push('<span class="filter-confirm fa fa-check-circle ' + filterConfirmIdx + '"></span>');
    filterRow.push('<span class="filter-remove ' + filterRemoveIdx + '" >&#10006</span>');
    filterRow.push("</li>");
    filterRow = filterRow.join("");
    newFilter = filterConfirmIdx;
    $("#add-filter").hide();
    $("#filters").append(filterRow);

    $('.' + filterRemoveIdx).hide();
    $('.' + filterColIdx).on('change', function() {
      Filters.filterValEdited($('.' + filterConfirmIdx));
      if(colType != Table.columns[this.selectedIndex].type) {
        colType = Table.columns[this.selectedIndex].type;
        console.log("here " + Filters.makeOpSelector(colType, filterOpIdx));
        $('.' + filterOpIdx).replaceWith(Filters.makeOpSelector(colType, filterOpIdx));
      }

    });
    $('.' + filterOpIdx).on('change', function() {
      Filters.filterValEdited($('.' + filterConfirmIdx));
    });
    $('.' + filterValIdx).on('input', function() {
      Filters.filterValEdited($('.' + filterConfirmIdx));
    });

    $('.' + filterConfirmIdx).on('click', function() {
      var column = $('.' + filterColIdx).val();
      var operator = $('.' + filterOpIdx).val();
      var value = $('.' + filterValIdx).val();
      var filtator = $('.' + filterOpIdx).val();
      var value = $('.' + filterValIdx).val();

      var filterAdded = Filters.pushFilter({
            'field': column,
            'type': operator,
            'value': value
      }, filterIdxClass)

      if (filterAdded) {
        $(this).hide();
        $("#csv-table").tabulator("setFilter", Filters.filters);

        $('.' + filterRemoveIdx).show()
        if(newFilter == filterConfirmIdx) {
          $("#add-filter").show();
          newFilter = '';
        }
      }
    })

    $('.' + filterRemoveIdx).on('click', function() {
      Filters.removeFilter(Filters.filterDict[filterIdxClass])

      $("#csv-table").tabulator("setFilter", Filters.filters);

      $('#' + filterIdxClass).remove();
    })
  }.bind(Filters);

  Filters.makeOpSelector = function(type, filterOpIdx) {
    console.log(type);
    console.log((type == 'string' ? this.strOpSelector : this.numOpSelector));
    var opSelector = (type == 'string' ? this.strOpSelector : this.numOpSelector);
    if(this.filterIdx > 0) {
      opSelector.splice(1, 1, filterOpIdx);
    }
    return opSelector.join("").replace("$", " ");
  };

  Filters.filterValEdited = function(confirmEle) {
    confirmEle.show();
  }
}();

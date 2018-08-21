'use strict'

window.onload = function () {
  if (typeof(window.Genesis) === "undefined") {
    window.Genesis = {};
  };

  var Filters = Genesis.Filters = {
    TEXT_OPERATORS: ['=', '!=', '&lt;', '&gt;', '&lt;=', '&gt;=', 'IN', 'LIKE'],
    NUM_OPERATORS: ['=', '!=', '&lt;', '&gt;', '&lt;=', '&gt;='],
    textOpSelector: ['<select class="filter-op$', 'filter-op-0', '" >'],
    numOpSelector: ['<select class="filter-op$', 'filter-op-0', '" >'], // Need $ as spaceholder, join trims space
    filtersApplied: [],
    filterIdx: 0,
    filterDict: {},
    filters: []
  }

  for (var i = 0; i < Filters.TEXT_OPERATORS.length; i++) {
    Filters.textOpSelector.push('<option value="' + Filters.TEXT_OPERATORS[i] + '" >' + Filters.TEXT_OPERATORS[i] + '</option>')
  }
  Filters.textOpSelector.push("</select>");

  for (var i = 0; i < Filters.NUM_OPERATORS.length; i++) {
    Filters.numOpSelector.push('<option value="' + Filters.NUM_OPERATORS[i] + '" >' + Filters.NUM_OPERATORS[i] + '</option>')
  }
  Filters.numOpSelector.push("</select>");

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
    this.filterIdx++;

    var opSelector = this.numOpSelector; // Row number is first
    console.log(this);
    if(this.filterIdx > 0) {
      opSelector.splice(1, 1, filterOpIdx);
    }
    var strOpElement = opSelector.join("").replace("$", " ");

    filterRow.push('<li class="filter-row" id="' + filterIdxClass + '" >')
    filterRow.push("<select class='filter-col " + filterColIdx + "' >")
    for (var i = 0; i < Genesis.Table.columns.length; i++) {
      filterRow.push("<option value=" + Genesis.Table.columns[i].field + ">" + Genesis.Table.columns[i].title + "</option>")
    }
    filterRow.push("</select>");
    filterRow.push(strOpElement);
    filterRow.push('<input class="filter-value ' + filterValIdx + '" type="text"></input>');
    filterRow.push('<span class="filter-confirm ' + filterConfirmIdx + '">&#9989</span>');
    filterRow.push('<span class="filter-remove ' + filterRemoveIdx + '" >&#10006</span>');
    filterRow.push("</li>");
    filterRow = filterRow.join("");
    newFilter = filterConfirmIdx;
    $("#add-filter").hide();
    $("#filters").append(filterRow);

    $('.' + filterRemoveIdx).hide();
    $('.' + filterColIdx).on('change', function() {
      Filters.filterValEdited($('.' + filterConfirmIdx), );
    });
    $('.' + filterOpIdx).on('change', function() {
      Filters.filterValEdited($('.' + filterConfirmIdx), );
    });
    $('.' + filterValIdx).on('input', function() {
      Filters.filterValEdited($('.' + filterConfirmIdx), );
    });

    $('.' + filterConfirmIdx).on('click', function() {
      var column = $('.' + filterColIdx).val();
      var operator = $('.' + filterOpIdx).val();
      var value = $('.' + filterValIdx).val();
      var filtator = $('.' + filterOpIdx).val();
      var value = $('.' + filterValIdx).val();
      console.log("column " + column)
      console.log("operator " + operator)
      console.log("value " + value)

      var filterAdded = Filters.pushFilter({
            'field': column,
            'type': operator,
            'value': value
      }, filterIdxClass)

      if (filterAdded) {
        $(this).hide();
        console.log(Filters.filters)
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

  Filters.filterValEdited = function(confirmEle) {
    confirmEle.show();
  }
}();

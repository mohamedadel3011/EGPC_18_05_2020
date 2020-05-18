
define([
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/on",
    "dojo/text!./ReportBarChart.html",
], function (_WidgetBase,
    _OnDijitClickMixin,
    _TemplatedMixin,
    Evented,
    declare,
    on,
    dijitTemplate) {
        return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented], {
            declaredClass: "ReportBarChartControl.ReportBarChartControlModule",
            templateString: dijitTemplate,
            options: {map: null},
            count: 0,
            fieldCount: 1,
            IsMulti: false,
            fieldInfos: [],
            fieldInfosNumber: [],
            lstLabels: [],
            lstValues: [],
            featureset: null,
            data: null,
            barChart: null,
            lstMultiLabel: [],
            lstMultiValues: [],
            reportBuilderWidget: null,
            fieldsIdentifyRes: [],
            isCancel: false,
            objLastBeforeApplySingle: null,
            objLastBeforeApplyMulti: null,
            lstMultiFieldGroupSelectValue: [],
            selectedColorList: null,
            nls: null,
            lstDuplicationSelectedItems: [],

            constructor: function (options) {
                this.count = options.count;
                this.reportBuilderWidget = options.reportBuilderWidget;
                this.nls = options.reportBuilderWidget.nls;
            },

            startup: function () {
                console.log('start widget');
            },

            destroy: function () {
                this.inherited(arguments);
            },

            getData: function (results, barChartIndex) {
                this.featureset = results.featureSet;
                this.fieldInfos = results.layerInfo.layerObject.infoTemplate.info.fieldInfos;
                this.data = results;

                //fill Drop Down list for single bar
                this.drawDropDownListFields(this.fieldInfos, "ddlBarChartFields" + this.count);
                var _this = this;

                //get field Info with Number
                if (results.queryWidget) {
                    this._getlstfieldInfoNumber(true);

                } else {
                    $.ajax({
                        type: 'GET',
                        async: false,
                        url: this.data.layerInfo.layerObject.url + "?f=pjson", success: function (result) {
                            var jsonArray = JSON.parse(result);
                            var fields = jsonArray.fields;
                            _this.fieldsIdentifyRes = fields;
                            _this._getlstfieldInfoNumber(false);

                        }
                    });
                }

                //fill first drop down list in Multi bar
                this.drawDropDownListFields(this.fieldInfosNumber, "selectFields" + this.count + "M" + "0");

                //Toggle Bar Chart (single - Mult)Field
                this.changeRadioButtonSingleMulti(this.count);

                //ColorPicker
                var colorList = ['000000', '993300', '333300', '003300', '003366', '000066', '333399', '333333',
                    '660000', 'FF6633', '666633', '336633', '336666', '0066FF', '666699', '666666', 'CC3333', 'FF9933', '99CC33', '669966', '66CCCC', '3366FF', '663366', '999999', 'CC66FF', 'FFCC33', 'FFFF66', '99FF66', '99CCCC', '66CCFF', '993366', 'CCCCCC', 'FF99CC', 'FFCC99', 'FFFF99', 'CCffCC', 'CCFFff', '99CCFF', 'CC99FF', 'FFFFFF'];
                var picker = $('.color-picker');

                for (var i = 0; i < colorList.length; i++) {
                    picker.append('<li class="color-item" data-hex="' + '#' + colorList[i] + '" style="background-color:' + '#' + colorList[i] + ';"></li>');
                }

                $('body').click(function () {
                    picker.fadeOut();
                });

                $('.call-picker').off('click');
                $('.call-picker').click(function (event) {

                    event.stopPropagation();
                    var selectedPicker = $(this).siblings('.color-picker');

                    picker.fadeOut();

                    selectedPicker.fadeIn();

                    selectedPicker.children('li').hover(function () {
                        var codeHex = $(this).data('hex');
                        $(this).parent('.color-picker').siblings('.color-holder').css('background-color', codeHex);
                        selectedPicker.val(codeHex);
                    });
                    _this.setActionButtonDisability(false);
                });
                $("#paletteUlID" + barChartIndex + " li").click(function () {
                    $("#paletteUlID" + barChartIndex + " li").removeClass("selected_family");
                    $(this).addClass('selected_family');
                    $("#Indicators_palette" + barChartIndex + " div")[0].innerHTML = $(this).find("div")[0].innerHTML;
                    if ($("#selectFields" + barChartIndex + "M0").val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });
                this.onChangesItemsSingle();
                this.onChangesItemsMulti();
                this.getLastSelectedItemsSingleBar();
                this.getLastSelectedItemsMultiBar();

                //Select2 Plugin
                $('select').select2();
            },

            _getlstfieldsWithtypeNumber: function (lstfields = []) {
                var fields = [];
                fields = lstfields.filter(function (field) {
                    return field.type === "esriFieldTypeSmallInteger"
                        || field.type === "esriFieldTypeInteger"
                        || field.type === "esriFieldTypeDouble";
                });
                return fields;
            },

            _getlstfieldInfoNumber: function (IsQuery = true) {
                //check is that come from identify or from query
                var fields = null;
                if (IsQuery) {
                    fields = this._getlstfieldsWithtypeNumber(this.featureset.fields);
                } else
                    fields = this._getlstfieldsWithtypeNumber(this.fieldsIdentifyRes);

                this.fieldInfosNumber = [];
                for (var i = 0; i < fields.length; i++) {
                    for (var field of this.fieldInfos) {
                        if (field.fieldName === fields[i].name) {
                            this.fieldInfosNumber.push(field);
                        }
                    }
                }
            },

            changeRadioButtonSingleMulti(count) {
                var _this = this;
                $("input[name$='field_type']").click(function () {

                    var field_value = $(this).val(),
                        parent = $(this).parents('.edit_mode'),
                        parent_id = '#' + parent.attr('id');
                    if (field_value === "single_field" + count) {
                        _this.setActionButtonDisability(true);
                    }
                    else if (field_value === 'multi_field' + count) {
                        _this.setActionButtonDisability(true);
                    }
                    $(parent_id + " div.type_field").hide();
                    $("#" + field_value).show();
                });
            },

            //#region SingleField
            onChangesItemsSingle() {
                var containerIndex = this.getContainerNumber();
                var _this = this;
                $("#ddlBarChartFields" + containerIndex).change(function () {
                    if ($("#ddlBarChartFields" + containerIndex).val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });
                $("#displayLabels_singlebar" + containerIndex).change(function () {
                    if ($("#ddlBarChartFields" + containerIndex).val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });

                $("#displayLegend_singlebar" + containerIndex).change(function () {
                    if ($("#ddlBarChartFields" + containerIndex).val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });

                $("#barDisplayNulls" + containerIndex).change(function () {
                    if ($("#ddlBarChartFields" + containerIndex).val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });
            },

            _setSingleFieldData: function () {
                var datasets = [];
                var _this = this;
                var barChartIndex = this.getContainerNumber();
                var selectedFieldName = $("#ddlBarChartFields" + barChartIndex + " option:selected").html();
                var backgroundColor = this._getColorPickerSinglePie();
                selectedFieldName = this.prepareLabelsLength([], selectedFieldName, false);
                datasets = [{
                    label: selectedFieldName,
                    data: _this.lstValues,
                    backgroundColor: backgroundColor,
                    hhoverBackgroundColor: '#ddd',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }];
                var data = {
                    labels: this.lstLabels,
                    datasets: datasets
                }
                return data;
            },

            _getGroupedlistBySelectedValue: function (selectedValue) {
                var counts = this.featureset.features.reduce((p, c) => {
                    if (selectedValue != "0") {
                        var name = c.attributes[selectedValue];
                        if (!p.hasOwnProperty(name)) {
                            p[name] = 0;
                        }
                        p[name]++;
                        return p;
                    }
                }, {});
                return counts;
            },

            fillListToDrawSingle: function (selectedValue) {
                var countainerNumberId = this.getContainerNumber();
                var listgrouped = this._getGroupedlistBySelectedValue(selectedValue);
                this.lstLabels = [];
                this.lstValues = [];
                for (var key in listgrouped) {
                    if (key !== "null" || $("#barDisplayNulls" + countainerNumberId).is(':checked')) {
                        this.lstLabels.push(key);
                        this.lstValues.push(listgrouped[key]);
                    }
                }
            },

            _getSelectedbarChartOptionsForSingle: function (countainerNumberId) {
                var options = null;
                var IsDisplayLegend = $("#displayLegend_singlebar" + countainerNumberId).prop('checked');
                var IsDisplayLabel = $("#displayLabels_singlebar" + countainerNumberId).prop('checked');

                options = this._getOptionsObjectSingle(IsDisplayLegend, IsDisplayLabel);
                return options;
            },

            _getColorPickerSinglePie: function () {
                var indexContainer = this.getContainerNumber();
                var backgroundColor = $("#singleBarChartColorPicker" + indexContainer).css("backgroundColor");
                return backgroundColor;
            },

            isCheckChangesInSingle: function () {
                var indexContainer = this.getContainerNumber();
                var selectedValue = $("#ddlBarChartFields" + indexContainer).val();
                if (selectedValue != "" && selectedValue != "0") {
                    return true;
                } else {
                    return false;
                }
            },

            getLastSelectedItemsSingleBar: function () {
                var indexContainer = this.getContainerNumber();
                var displaylegand = $("#displayLegend_singlebar" + indexContainer).prop('checked');
                var displaylabel = $("#displayLabels_singlebar" + indexContainer).prop('checked');
                var displayNulls = $("#barDisplayNulls" + indexContainer).prop('checked');

                this.objLastBeforeApplySingle = {};
                this.objLastBeforeApplySingle.displaylegand = displaylegand;
                this.objLastBeforeApplySingle.displaylabel = displaylabel;
                this.objLastBeforeApplySingle.displayNulls = displayNulls;
                var ddlbarChartFieldsSingle = document.getElementById("ddlBarChartFields" + indexContainer);
                var selectedValue = ddlbarChartFieldsSingle.value;
                if (selectedValue != "") {
                    this.objLastBeforeApplySingle.selectedValue = selectedValue;
                }
                //color
                this.objLastBeforeApplySingle.BackgroundColor = $("#singleBarChartColorPicker" + indexContainer).css("backgroundColor");
            },

            _setlastSelectedItemsSingleBar: function () {
                var indexContainer = this.getContainerNumber();
                if (this.objLastBeforeApplySingle) {
                    $("#displayLegend_singlebar" + indexContainer).prop('checked', this.objLastBeforeApplySingle.displaylegand);
                    $("#displayLabels_singlebar" + indexContainer).prop('checked', this.objLastBeforeApplySingle.displaylabel);
                    $("#barDisplayNulls" + indexContainer).prop('checked', this.objLastBeforeApplySingle.displayNulls);
                    var ddlbarChartFieldsSingle = document.getElementById("ddlBarChartFields" + indexContainer);
                    ddlbarChartFieldsSingle.value = this.objLastBeforeApplySingle.selectedValue;
                    $("#singleBarChartColorPicker" + indexContainer).css("backgroundColor", this.objLastBeforeApplySingle.BackgroundColor);
                }
            },

            _getOptionsObjectSingle: function (IsShowlegand = true, IsShowLablel = false, DisplayCount = false, DisplayPresentage = false) {
                var options = {
                    tooltips: {
                        enabled: IsShowLablel,
                        callbacks: {
                            label: function (tooltipItem, data) {
                                //get the concerned dataset
                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                //calculate the total of this data set
                                var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                    return previousValue + currentValue;
                                });
                                //get the current items value
                                var currentValue = dataset.data[tooltipItem.index];
                                //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                                var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                                if (DisplayPresentage) {
                                    return percentage + "%";
                                } else {
                                    return currentValue;
                                }
                            }
                        }
                    },
                    legend: {
                        position: 'bottom',
                        display: IsShowlegand
                    }
                };
                return options;
            },

            //#endregion
            //#region Multi
            onChangesItemsMulti() {
                var containerIndex = this.getContainerNumber();
                var _this = this;
                $("#selectFields" + containerIndex + "M0").change(function () {
                    if ($("#selectFields" + containerIndex + "M0").val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });
                $("#displayLabels_multibar" + containerIndex).change(function () {
                    if ($("#selectFields" + containerIndex + "M0").val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });

                $("#displayLegend_multibar" + containerIndex).change(function () {
                    if ($("#selectFields" + containerIndex + "M0").val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });

                $("#barDisplayNulls" + containerIndex).change(function () {
                    if ($("#selectFields" + containerIndex + "M0").val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });
                $("#bar_edit_mode" + containerIndex + " input:radio").change(function () {
                    if ($("#selectFields" + containerIndex + "M0").val() != 0) {
                        _this.setActionButtonDisability(false);
                    }
                });
            },

            _getlstSelectedDropDownList: function () {
                var countainerNumberId = this.getContainerNumber();
                var list = [];
                for (var i = 0; i < this.fieldCount; i++) {
                    var selection = $("#selectFields" + countainerNumberId + "M" + i + " option:selected");

                    if (selection != null && selection.length > 0)
                        list.push(selection);
                }
                return list;
            },

            _getSelectedbarChartOptionsForMulti: function (countainerNumberId) {
                var options = null;
                var IsDisplayLegend = $("#displayLegend_multibar" + countainerNumberId).prop('checked');
                var IsDisplayLabel = $("#displayLabels_multibar" + countainerNumberId).prop('checked');

                options = this._getOptionsObjectMulti(IsDisplayLegend, IsDisplayLabel);
                return options;
            },

            _getOptionsObjectMulti: function (IsShowlegand = true, IsShowLablel = false, DisplayCount = false, DisplayPresentage = false) {
                var options = {
                    barValueSpacing: 20,
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,
                            }
                        }]
                    },
                    tooltips: {
                        enabled: IsShowLablel,
                        mode: "label",

                    },
                    legend: {
                        position: 'bottom',
                        display: IsShowlegand
                    }
                };
                return options;
            },

            prepareListMultiValues: function () {
                var changedlist = [];
                for (var j = 0; j < this.lstMultiLabel.length; j++) {
                    var list = [];
                    for (var i = 0; i < this.lstMultiValues.length; i++) {
                        list[i] = 0;
                    }
                    list[j] = this.lstMultiValues[j];
                    changedlist.push(list);
                }
                this.lstMultiValues = changedlist;
            },

            fillListToDrawMulti: function (IsSum = true) {
                var listSelectedOptions = this._getlstSelectedDropDownList();

                this.lstMultiLabel = [];
                this.lstMultiValues = [];
                this.lstDuplicationSelectedItems = [];
                for (var i = 0; i < listSelectedOptions.length; i++) {
                    this.lstMultiLabel.push(listSelectedOptions[i].html());
                    var duplicationlist = this._getDuplicationSelectedItems(listSelectedOptions[i].html());

                    var values = this._getFeaturesValuesByAttributeName(listSelectedOptions[i].val());
                    var calculatedValue = null;
                    var totalsum = this._calculateSummtionForValues(values);
                    if (IsSum) {
                        calculatedValue = totalsum;

                    } else {
                        calculatedValue = this._calculateAverageForValues(values, totalsum);
                    }
                    this.lstMultiValues.push(calculatedValue);
                    if (duplicationlist.length > 0) {
                        var dropDownduplication = document.getElementById(listSelectedOptions[i].parent()[0].id);

                        this.lstMultiLabel.pop();
                        this.lstMultiValues.pop();
                        this.lstDuplicationSelectedItems.push(dropDownduplication);
                    }
                }
                this.lstMultiLabel = this.prepareLabelsLength(this.lstMultiLabel);
            },

            _calculateSummtionForValues: function (values) {
                var sum = 0;
                for (var i = 0; i < values.length; i++) {
                    if (values[i] != null) {
                        sum += values[i];
                    }
                }
                return sum;
            },

            _getDuplicationSelectedItems(item) {
                let findDuplicates = this.lstMultiLabel.filter((item, index) => this.lstMultiLabel.indexOf(item) != index);
                return findDuplicates;
            },

            _calculateAverageForValues: function (values, totalsum) {
                var average = 0;
                average = totalsum / values.length;
                return average;
            },

            _setMuliFieldsData: function () {
                var datasets = [];
                var backgroundColorMultiChar = this._getBackgroundColor();
                for (var i = 0; i < this.lstMultiLabel.length; i++) {
                    itemDataset = {};
                    itemDataset.label = this.lstMultiLabel[i];
                    itemDataset.data = this.lstMultiValues[i];
                    itemDataset.backgroundColor = backgroundColorMultiChar[i];
                    itemDataset.hhoverBackgroundColor = '#ddd';
                    itemDataset.borderColor = 'rgba(255, 99, 132, 1)';
                    itemDataset.borderWidth = 1; 
                    datasets.push(itemDataset);
                }
                var data = {
                    labels: this.lstMultiLabel,
                    datasets: datasets
                }
                return data;
            },

            _getBackgroundColor: function () {
                var containerIndex = this.getContainerNumber();
                var lstColors = [];
                $("#Indicators_palette" + containerIndex + " div").children().each((index, span) => {
                    var color = $(span).css('background-color');
                    lstColors.push(color);
                });
                return lstColors;
            },

            _getFeaturesValuesByAttributeName: function (attributeName) {
                lstValues = [];
                for (var i = 0; i < this.featureset.features.length; i++) {
                    for (var key in this.featureset.features[i].attributes) {
                        if (key == attributeName)
                            lstValues.push(this.featureset.features[i].attributes[key]);
                    }
                }
                return lstValues;
            },

            _getlstGroupFieldMulti: function () {
                var countainerNumberId = this.getContainerNumber();
                var list = [];
                //formGroupMulti0f1
                for (var i = 0; i < this.fieldCount; i++) {
                    var selection = $("#formGroupMulti" + countainerNumberId + "f" + i);
                    if (selection != null && selection.length > 0) {
                        list.push(selection);
                    }
                }
                return list;
            },

            _deletelstGroupMulti: function () {
                var containerIndex = this.getContainerNumber();
                for (var i = 1; i < this.fieldCount; i++) {
                    var selection = $("#formGroupMulti" + containerIndex + "f" + i);

                    if (selection != null && selection.length > 0)
                        $(selection).remove();
                }
            },

            _addlstGroupMulti: function (lstAdded) {
                //chart_field_container_countno
                var indexContainer = this.getContainerNumber();
                for (var i = 0; i < lstAdded.length; i++) {
                    var value = this.lstMultiFieldGroupSelectValue[i + 1].val();
                    $(lstAdded[i]).find("select").val(value)
                    document.getElementById("chart_field_container_countno" + indexContainer).appendChild(lstAdded[i][0]);
                }
            },

            getLastSelectedItemsMultiBar: function () {
                var indexContainer = this.getContainerNumber();
                // the div of selection multi fields
                this.objLastBeforeApplyMulti = {};
                //get first field in multi values
                var firstDdlField = $("#selectFields" + indexContainer + "M0").val();
                this.objLastBeforeApplyMulti.firstDdlField = firstDdlField;
                //get all group with values
                this.objLastBeforeApplyMulti.lstGroupMultiFields = this._getlstGroupFieldMulti();
                this.lstMultiFieldGroupSelectValue = this._getlstSelectedDropDownList();
                //get background colors
                this.objLastBeforeApplyMulti.lstBackgroundColors = this._getBackgroundColor();
                //get sum
                var sum = $("#sum" + indexContainer).prop("checked");
                this.objLastBeforeApplyMulti.sum = sum;
                var avg = $("#avg" + indexContainer).prop("checked");
                this.objLastBeforeApplyMulti.average = avg;
                var displaylegand = $("#displayLegend_multibar" + indexContainer).prop('checked');
                var displaylabel = $("#displayLabels_multibar" + indexContainer).prop('checked');
                var displayNulls = $("#barDisplayNulls" + indexContainer).prop('checked');

                this.objLastBeforeApplyMulti.displaylegand = displaylegand;
                this.objLastBeforeApplyMulti.displaylabel = displaylabel;
                this.objLastBeforeApplyMulti.displayNulls = displayNulls;
                this.objLastBeforeApplyMulti.selectedColors = $("#Indicators_palette" + indexContainer + " div")[0].innerHTML;
            },

            _validateDuplication() {
                if (this.lstDuplicationSelectedItems.length > 0) {
                    var _this = this;
                    swal({
                        title: this.nls.titlevalidateDuplication,
                        text: this.nls.textvalidateDuplication,
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "Yes",
                        closeOnConfirm: true
                    }, function () {
                            for (var i = 0; i < _this.lstDuplicationSelectedItems.length; i++) {
                                _this.lstDuplicationSelectedItems[i].selectedIndex = 0;
                                $("#" + _this.lstDuplicationSelectedItems[i].id).val("0");
                            }
                    });
                    return true;
                } else {

                    return false;
                }
            },

            _setlastSelectedItemsMultiBar: function () {
                if (this.objLastBeforeApplyMulti) {
                    var indexContainer = this.getContainerNumber();
                    //set first field in multi values
                    $("#selectFields" + indexContainer + "M0").val(this.objLastBeforeApplyMulti.firstDdlField);
                    //set all group with values
                    this._deletelstGroupMulti();
                    this._addlstGroupMulti(this.objLastBeforeApplyMulti.lstGroupMultiFields);
                    //set background colors
                    $("#Indicators_palette" + indexContainer + " div")[0].innerHTML = this.selectedColorList;
                    //set sum
                    $("#sum" + indexContainer).prop("checked", this.objLastBeforeApplyMulti.sum);
                    $("#avg" + indexContainer).prop("checked", this.objLastBeforeApplyMulti.average);
                    $("#displayLegend_multibar" + indexContainer).prop('checked', this.objLastBeforeApplyMulti.displaylegand);
                    $("#displayLabels_multibar" + indexContainer).prop('checked', this.objLastBeforeApplyMulti.displaylabel);
                    $("#barDisplayNulls" + indexContainer).prop('checked', this.objLastBeforeApplyMulti.displayNulls);
                    $("#Indicators_palette" + indexContainer + " div")[0].innerHTML = this.objLastBeforeApplyMulti.selectedColors;

                }
            },

            isCheckChangesInMulti: function () {
                var IndexContainer = this.getContainerNumber();
                var selectedValue = $("#selectFields" + IndexContainer + "M0").val();
                if (selectedValue != "" && selectedValue != "0") {
                    return true;
                } else {
                    return false;
                }
            },

            isFieldsValueSelected: function () {
                isSelected = true;
                var lstSelectedValue = this._getlstSelectedDropDownList();
                for (var i = 0; i < lstSelectedValue.length; i++) {
                    var value = lstSelectedValue[i].val();
                    if (value == "0" || value == "") {
                        isSelected = false;
                        break;
                    }
                }
                return isSelected;
            },

            confinramationSomeItemNotSelected: function () {
                swal({
                    title: "Not Validate",
                    text: "Some of your Fields not Selected,Please select all fields?",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Yes",
                    closeOnConfirm: true
                }, function () { });
            },
            //#endregion

            //#region Common
            //this Function Created to Draw DropDownList Fields...
            drawDropDownListFields: function (dropDownListFields, dllId) {
                this.select = document.getElementById(dllId);
                this.select.innerHTML = "";
                var el = document.createElement("option");
                el.textContent = this.nls.DDLDefaultValue;
                el.value = 0;
                this.select.appendChild(el);
                var ddlOptions = document.getElementById(dllId).options;
                //Check Length Of Option has Data Or Not .. 
                if (ddlOptions.length > 1) {
                    return;
                }
                else {
                    for (var i = 0; i < dropDownListFields.length; i++) {
                        el = document.createElement("option");
                        el.textContent = dropDownListFields[i].label;
                        el.value = dropDownListFields[i].fieldName;
                        this.select.appendChild(el);
                    }
                }
                _this = this;
                $(this.select).change(function (event) {
                    var selectedValue = this.value;
                    var index = _this.getContainerdllNumber(event.currentTarget.id);
                    var IsSingle = $("#singleField" + index).prop("checked");
                    if (IsSingle) {
                        if (_this.isCheckChangesInSingle())
                            _this.setActionButtonDisability(false);
                        else
                            _this.setActionButtonDisability(true);
                    } else {
                        if (_this.isCheckChangesInMulti())
                            _this.setActionButtonDisability(false);
                        else
                            _this.setActionButtonDisability(true);
                    }
                });

            },

            clearCanvasBarChart: function (canvas) {
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                if (this.barChart != undefined)
                    this.barChart.destroy();
            },

            getContainerNumber: function () {
                var elementId = this.id;
                var counteinercount = elementId.match(/\d+/)[0];
                return counteinercount;
            },

            getContainerdllNumber: function (event) {
                var elementId = event;
                var counteinercount = elementId.match(/\d+/)[0];
                return counteinercount;
            },

            drawBarChart: function (IsSingle = true) {
                var barChartIndex = this.getContainerNumber();
                var canvas = document.getElementById('myBarChart' + barChartIndex);
                this.clearCanvasBarChart(canvas);
                var options = null;
                var data = null;
                if (IsSingle) {
                    options = this._getSelectedbarChartOptionsForSingle(barChartIndex);
                    data = this._setSingleFieldData();
                }

                else {
                    options = this._getSelectedbarChartOptionsForMulti(barChartIndex);
                    data = this._setMuliFieldsData();
                }

                this.barChart = new Chart(canvas, {
                    type: 'bar',
                    data: data,
                    options: options
                });
            },

            _getIdBySliceChar: function (sender, characterdelsender, charDelreciver, reciverId) {
                var containerIndex = this.getContainerNumber();
                var dlimeterIndex = sender.indexOf(characterdelsender);
                var Indexfield = sender.slice(dlimeterIndex + 1);
                var element = document.getElementById(reciverId + containerIndex + charDelreciver + Indexfield);
                return element;
            },

            setActionButtonDisability: function (isDisable) {
                var containerIndex = this.getContainerNumber();
                $("#bar_reset_btn" + containerIndex).prop("disabled", isDisable);
                $("#bar_apply_btn" + containerIndex).prop("disabled", isDisable);
            },

            toggleMode: function () {
                var index = this.getContainerNumber();
                // toggle modes
                $('#bar_edit_mode' + index).toggleClass('d-block');
                $('#bar_view_mode' + index).toggleClass('d-none');
                //hide title btns
                $('#barViewMode' + index).toggleClass('d-none');
                $('#bar_deleteItem' + index).toggleClass('d-none');
            },

            prepareLabelsLength: function (listLabels, strlabel, isList = true) {
                var maxChartLabelLength = this.reportBuilderWidget.config.maxChartLabelLength;
                if (isList) {
                    var newLabelList = [];
                    for (var i = 0; i < listLabels.length; i++) {
                        var label = listLabels[i];
                        if (label.length >= maxChartLabelLength) {
                            newLabelList.push(label.slice(0, maxChartLabelLength) + "..");
                        } else {
                            newLabelList.push(label);
                        }
                    }
                    return newLabelList;
                } else {
                    if (strlabel) {
                        if (strlabel.length >= maxChartLabelLength) {
                            return strlabel.slice(0, maxChartLabelLength) + "..";
                        } else {
                            return strlabel;
                        }
                    }
                }
            },

            //#endregion

            //#region Events
            onClickReset: function () {
                //do your bussiness;
                var index = this.getContainerNumber();
                var _this = this;
                swal({
                    title: this.nls.titlerestConfigurationswal,
                    text: this.nls.textrestConfigurationswal,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: this.nls.confirmButtonTextswal,
                    cancelButtonText: this.nls.cancelButtonTextswal,
                    closeOnConfirm: true
                }, function () {
                        _this.isCancel = true;
                        var IsSingle = $("#singleField" + index).prop("checked");
                        if (IsSingle) {
                            _this._setlastSelectedItemsSingleBar();
                            if (_this.objLastBeforeApplySingle.selectedValue === "0")
                                _this.setActionButtonDisability(true);
                        } else {
                            _this._setlastSelectedItemsMultiBar();
                            if (_this.objLastBeforeApplyMulti.firstDdlField === "0") {
                                $('#add_chart_field_countno' + index).prop("disabled", false);
                                _this.setActionButtonDisability(true);
                            }
                        }
                    });
            },

            onClickCancel: function (event) {
                //do your bussiness;
                var index = this.getContainerNumber();
                var _this = this;
                swal({
                    title: this.nls.textCancelConfigurationswal,
                    text: this.nls.textrestConfigurationswal,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: this.nls.confirmButtonTextswal,
                    cancelButtonText: this.nls.cancelButtonTextswal,
                    closeOnConfirm: true
                },
                    function () {
                        _this.isCancel = true;
                        var IsSingle = $("#singleField" + index).prop("checked");
                        if (IsSingle) {
                            _this._setlastSelectedItemsSingleBar();
                            _this.toggleMode();
                        } else {
                            _this._setlastSelectedItemsMultiBar();
                            _this.toggleMode();
                        }

                    });
            },

            onClickApply: function (event) {
                // do your validations
                //set delete btn visibility for first time
                var index = event.currentTarget.id.replace(/[^0-9]/g, '');
                var IsSingle = $("#singleField" + index).prop("checked");
                if (IsSingle) {
                    var selectedValue = $("#ddlBarChartFields" + index + " option:selected").val();
                    this.fillListToDrawSingle(selectedValue);
                    this.getLastSelectedItemsSingleBar();
                } else {
                    var IsSum = $("#sum" + index).prop("checked");
                  
                    if (this.isFieldsValueSelected()) {

                            this.fillListToDrawMulti(IsSum);
                            this.prepareListMultiValues();
                            this.getLastSelectedItemsMultiBar();
                        
                    } else {
                        this.confinramationSomeItemNotSelected();
                        return false;
                    }
                    if (this._validateDuplication()) {
                        return;
                    }
                    this.selectedColorList = $("#Indicators_palette" + index + " div")[0].innerHTML;
                }
                this.drawBarChart(IsSingle);
                $('#bar_deleteItem' + index).addClass('d-none');
                this.onClickConfigrationItem(event);
            },

            // #region onClickConfigrationItem
            // <summary>
            // toggle visiblty between two modes
            // </summary>
            // #endregion
            onClickConfigrationItem: function (event) {
                //extract index 
                var index = event.currentTarget.id.replace(/[^0-9]/g, '');
                // toggle modes
                $('#bar_edit_mode' + index).toggleClass('d-block');
                $('#bar_view_mode' + index).toggleClass('d-none');
                //hide title btns
                $('#barViewMode' + index).toggleClass('d-none');
                $('#bar_deleteItem' + index).toggleClass('d-none');
                $("#bar_cancel_btn" + index).prop("disabled", false);
                this.setActionButtonDisability(true);
            },
            // #endregion

            // #region onClickDeleteItem
            // <summary>
            // delete current bar chart
            // </summary>
            // #endregion
            onClickDeleteItem: function (event) {
                var index = event.currentTarget.id.replace(/[^0-9]/g, '');
                var deletedChart = $('#ReportBarChart' + index);
                swal({
                    title: this.nls.titleDeleteChartswal,
                    text: this.nls.textrestConfigurationswal,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: this.nls.confirmButtonTextswal,
                    cancelButtonText: this.nls.cancelButtonTextswal,
                    closeOnConfirm: true
                },
                    function () {
                        deletedChart.remove();
                    });
            },

            //Handle Color Picker
            onClickColorPalette: function (e) { },

            //Add Chart Field Row 
            onClickAddChartField: function (event) {
                event.preventDefault();
                var containerIndex = this.getContainerNumber();
                this.setActionButtonDisability(false);
                var count = $('#chart_field_container_countno' + containerIndex).children().length,
                    add_chart_field_countno_btn = $('#add_chart_field_countno' + containerIndex);

                if (count < 5) {
                    var chart_field_container = document.getElementById('chart_field_container_countno' + containerIndex);
                    var form_group_div = document.createElement('div');
                    form_group_div.className = "form-group row mb-1 no-gutters align-items-center";
                    form_group_div.id = "formGroupMulti" + containerIndex + "f" + this.fieldCount;
                    var CF_label = document.createElement('label');
                    CF_label.className = "col-sm-3 col-form-label font-weight-bold font_size_14 text-muted mb-0";
                    CF_label.textContent = this.nls.chartFieldName;
                    form_group_div.appendChild(CF_label);

                    var CF_div = document.createElement('div');
                    CF_div.className = "col-sm-9 custom-control d-flex flex-column";
                    form_group_div.appendChild(CF_div);

                    var CF_div_child = document.createElement('div');
                    CF_div_child.className = "d-inline-flex justify-content-between align-items-center";
                    CF_div.appendChild(CF_div_child);

                    var CF_select = document.createElement('select');
                    CF_select.className = "form-control border-secondary text-dark p-0 font_size_12";
                    CF_select.id = "selectFields" + containerIndex + "M" + this.fieldCount;
                    CF_div_child.appendChild(CF_select);

                    var CF_select_option = document.createElement('option');
                    CF_select.appendChild(CF_select_option);

                    var CF_deleteIcon = document.createElement('i');
                    CF_deleteIcon.className = "far fa-trash-alt fa-lg border border-secondary p-2 " + this.nls.margin_x_2_reverse + " rounded text-secondary cf_delete ";
                    CF_deleteIcon.id = "deleteItem" + containerIndex + "c" + this.fieldCount;
                    var CF_deleteIcon_attr = document.createAttribute("data-dojo-attach-event");
                    CF_deleteIcon_attr.value = "click:onClickDeleteChartField";
                    CF_deleteIcon.setAttributeNode(CF_deleteIcon_attr);

                    CF_div_child.appendChild(CF_deleteIcon);
                    var _this = this;
                    _this.containerIndex = containerIndex;
                    on(CF_deleteIcon, "click", function () {
                        var characterdel = 'c';
                        var chardelrecive = 'f';
                        var groupId = _this._getIdBySliceChar(this.id, characterdel, chardelrecive, "formGroupMulti");
                        groupId.remove();
                        $('#add_chart_field_countno' + _this.containerIndex).prop('disabled', false);
                        _this.setActionButtonDisability(false);
                    });
                    on(CF_select, "change", function () {
                        _this.setActionButtonDisability(false);
                    });
                    chart_field_container.appendChild(form_group_div);

                    //Select2 Plugin
                    $('select').select2();

                    if (count == 4) {
                        $('#add_chart_field_countno' + containerIndex).prop('disabled', true);
                    }
                    this.drawDropDownListFields(this.fieldInfosNumber, CF_select.id);

                } else {
                    $('#add_chart_field_countno' + containerIndex).prop('disabled', true);
                }
                this.fieldCount++;
            }

            //#endregion
        });
    });
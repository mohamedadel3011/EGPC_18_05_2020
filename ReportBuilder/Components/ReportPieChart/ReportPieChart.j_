define([
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/text!./ReportPieChart.html",
], function (_WidgetBase,
    _OnDijitClickMixin,
    _TemplatedMixin,
    Evented,
    declare,
    dijitTemplate) {
    var _this = this;
    return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented], {
        declaredClass: "ReportPieChartControl.ReportPieChartControlModule",
        templateString: dijitTemplate,
        options: {map: null},
        fieldInfos: [],
        lstLabels: [],
        lstValues: [],
        lstBackgroudcolor: [],
        pieChart: null,
        featureset: null,
        data: null,
        count: null,
        objlastSelectedBeforeApply: null,
        IsCancel: false,
        nls: null,

        constructor: function (options) {
            this.count = this.options.count;
            this.nls = options.reportBuilderWidget.nls;
            this.pieChartNumber = options.pieChartNumber;
        },

        startup: function () {
            console.log('start widget');
        },

        destroy: function () {
            this.inherited(arguments);
        },
       
        getData: function (results) {
            console.log(results);
            this.featureset = results.featureSet;
            this.fieldInfos = results.layerInfo.layerObject.infoTemplate.info.fieldInfos;
            this.data = results;
            this.drawDropDownListFields(this.fieldInfos);
            var containerIndex = this.getContainerNumber();
            this._getLastSelectedItems(containerIndex);
            $("#displayLabels" + containerIndex).change(function () {
                if ($("#ddlPieChartFields" + containerIndex).val() != 0) {
                    $("#pie_apply_btn" + containerIndex).prop("disabled", false);
                    $("#pie_reset_btn" + containerIndex).prop("disabled", false);
                }
            });

            $("#displayLegendPie" + containerIndex).change(function () {
                if ($("#ddlPieChartFields" + containerIndex).val() != 0) {
                    $("#pie_apply_btn" + containerIndex).prop("disabled", false);
                    $("#pie_reset_btn" + containerIndex).prop("disabled", false);
                }
            });

            $("#piedisplayNulls" + containerIndex).change(function () {
                if ($("#ddlPieChartFields" + containerIndex).val() != 0) {
                    $("#pie_apply_btn" + containerIndex).prop("disabled", false);
                    $("#pie_reset_btn" + containerIndex).prop("disabled", false);
                }
            });

            $("#pie_edit_mode" + containerIndex + " input:radio").change(function () {
                if ($("#ddlPieChartFields" + containerIndex).val() != 0) {
                    $("#pie_apply_btn" + containerIndex).prop("disabled", false);
                    $("#pie_reset_btn" + containerIndex).prop("disabled", false);
                }
            });
            //Select2 Plugin
            $('select').select2();
        },

        //this Function Created to Draw DropDownList Fields...
        drawDropDownListFields: function (dropDownListFields) {
            this.select = document.getElementById("ddlPieChartFields" + this.count);
            this.select.innerHTML = "";
            var el = document.createElement("option");
            el.textContent = this.nls.DDLDefaultValue;
            el.value = 0;
            this.select.appendChild(el);
            var ddlOptions = document.getElementById('ddlPieChartFields' + this.count).options;
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
                var countainerNumberId = _this.getContainerdllNumber(event.currentTarget.id);
                if (selectedValue != "0") {
                    _this._filllistToDraw(selectedValue);
                    $("#pie_apply_btn" + countainerNumberId).prop("disabled", false);
                    $("#pie_reset_btn" + countainerNumberId).prop("disabled", false);
                    if (_this.IsCancel) {
                        _this.drawColorPicker(countainerNumberId, true);
                    } else {
                        _this.drawColorPicker(countainerNumberId, false);
                    }
                } else {
                    var pieChartColorPicker = document.getElementById("pieChartPickerColor" + countainerNumberId);
                    pieChartColorPicker.className = "";
                    pieChartColorPicker.innerHTML = "";
                    $("#pie_apply_btn" + countainerNumberId).prop("disabled", true);
                    $("#pie_reset_btn" + countainerNumberId).prop("disabled", true);
                }
                _this.IsCancel = false;
            });
        },

        drawPieChart: function (countainerNumberId) {
            const canvas = document.getElementById('myPieChart' + countainerNumberId);
            this.clearCanvasPieChart(canvas);
            var options = this._getSelectedPieChartOptions(countainerNumberId);
            var BackgroundColorsArray = this._getBackgroundColorsArray(countainerNumberId)
            var _this = this;
            this._filterIfCheckNullsData(countainerNumberId);

            this.pieChart = new Chart(canvas, {
                type: 'pie',
                data: {
                    labels: _this.lstLabels,
                    datasets: [{
                        label: 'Subset of Parcels Shape Area',
                        data: _this.lstValues,
                        backgroundColor: BackgroundColorsArray,
                        hhoverBackgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: options
            });
            this.pieChart.canvas.parentNode.style.height = '340px';
            $("#pie_edit_mode" + countainerNumberId).hide();
            $("#pie_view_mode" + countainerNumberId).show();
        },

        showLabelChart: function (countainerNumberId) {
            Chart.plugins.register({
                afterDatasetsDraw: function (chartInstance, easing) {
                    // To only draw at the end of animation, check for easing === 1
                    if ($("#displayLabels" + countainerNumberId).prop('checked')) {
                    var ctx = chartInstance.chart.ctx;
                    chartInstance.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.getDatasetMeta(i);
                        if (!meta.hidden) {
                            meta.data.forEach(function (element, index) {
                                // Draw the text in black, with the specified font
                                ctx.fillStyle = 'white';
                                var fontSize = 10;
                                var fontStyle = 'normal';
                                var fontFamily = 'Helvetica Neue';
                                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                                //calculate the total of this data set
                                var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                    return previousValue + currentValue;
                                });
                                // Just naively convert to string for now
                                var dataString = dataset.data[index].toString();
                                // Make sure alignment settings are correct
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var padding = 5;
                                var position = element.tooltipPosition();
                                //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                                var percentage = Math.floor(((dataString / total) * 100) + 0.5);

                                if (!($("#count" + _this.count).prop('checked'))) {
                                    dataString = percentage + "%";
                                }
                                ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                            });
                        }
                    });
                }
            }
            });
        },

        drawColorPicker(countainerNumberId, Islast = false) {
            var pieChartColorPicker = document.getElementById("pieChartPickerColor" + countainerNumberId);
            pieChartColorPicker.innerHTML = "";
            pieChartColorPicker.className = "";
            //------UI---------
            var pieChartPickerColor_child = document.createElement("div");
            pieChartPickerColor_child.className = "form-group mb-2 border border-secondary rounded p-2 pb-0";
            pieChartColorPicker.appendChild(pieChartPickerColor_child);

            var pieChartPickerColor_child_child = document.createElement("div");
            pieChartPickerColor_child_child.className = "row no-gutters";
            pieChartPickerColor_child.appendChild(pieChartPickerColor_child_child);
            //---------------
            for (var i = 0; i < this.lstLabels.length; i++) {
                var pieChartdivCol = document.createElement("div");
                pieChartdivCol.className = "col-sm-4 color-wrapper mb-1";
                var colorholderdiv = document.createElement("div");
                colorholderdiv.id = "colorPicker" + countainerNumberId + i;
                colorholderdiv.className = "colorPicker" + countainerNumberId + " color-holder call-picker col-sm-2 " + this.nls.float_reverse;
                if (Islast) {
                    colorholderdiv.style = "background-color:" + this.objlastSelectedBeforeApply.lstBackgroudcolor[i];
                } else {
                    var color = this.generateColorCode();
                    colorholderdiv.style = "background-color:" + color;
                }
                var spanholderdiv = document.createElement("span");
                spanholderdiv.className = "text-dark mt-1 d-inline-block col-sm-10";
                spanholderdiv.innerHTML = this.lstLabels[i];
                var colorpickerdiv = document.createElement("div");
                colorpickerdiv.className = "color-picker " + this.nls.color_picker_local;
                colorpickerdiv.style = "display:none";
                pieChartdivCol.appendChild(colorholderdiv);
                pieChartdivCol.appendChild(spanholderdiv);
                pieChartdivCol.appendChild(colorpickerdiv);
                pieChartPickerColor_child_child.appendChild(pieChartdivCol); //UI
            }
            this.initColorPicker(countainerNumberId);
        },

        initColorPicker: function (countainerNumberId) {
            //ColorPicker
            var colorList = ['000000', '993300', '333300', '003300', '003366', '000066', '333399', '333333',
                '660000', 'FF6633', '666633', '336633', '336666', '0066FF', '666699', '666666', 'CC3333', 'FF9933', '99CC33', '669966', '66CCCC', '3366FF', '663366', '999999', 'CC66FF', 'FFCC33', 'FFFF66', '99FF66', '99CCCC', '66CCFF', '993366', 'CCCCCC', 'FF99CC', 'FFCC99', 'FFFF99', 'CCffCC', 'CCFFff', '99CCFF', 'CC99FF', 'FFFFFF'];
            var picker = $('.color-picker');
            picker.empty();
            for (var i = 0; i < colorList.length; i++) {
                picker.append('<li class="color-item" data-hex="' + '#' + colorList[i] + '" style="background-color:' + '#' + colorList[i] + ';"></li>');
            }

            $('body').click(function () {
                picker.fadeOut();
            });

            $('.colorPicker' + countainerNumberId).off('click');
            $('.colorPicker' + countainerNumberId).click(function (event) {

                event.stopPropagation();
                var selectedPicker = $(this).siblings('.color-picker');

                picker.fadeOut();

                selectedPicker.fadeIn();

                selectedPicker.children('li').hover(function () {
                    var codeHex = $(this).data('hex');
                    $(this).parent('.color-picker').siblings('.color-holder').css('background-color', codeHex);
                    selectedPicker.val(codeHex);
                });
                $("#pie_apply_btn" + countainerNumberId).prop("disabled", false);
                $("#pie_reset_btn" + countainerNumberId).prop("disabled", false);
            });
        },

        _getBackgroundColorsArray: function (countainerNumberId) {
            var list = [];
            defaultlist = ['#056966', '#847766', '#408841', '#403366', '#783426'];
            $.each($("#pie_edit_mode" + countainerNumberId + " .color-holder.call-picker"), function () {
                var color = $(this).css("background-color");
                list.push(color);
            });
            if (list.length > 0) {
                return list;
            } else {
                return defaultlist;
            }
        },

        _filterIfCheckNullsData(countainerNumberId) {
            if (!($("#piedisplayNulls" + countainerNumberId).is(':checked'))) {
                var lstNewLabels = [];
                var lstNewValues = [];
                for (var i = 0; i < this.lstLabels.length; i++) {
                    if (this.lstLabels[i] != "null" && this.lstLabels[i] != null) {
                        lstNewLabels.push(this.lstLabels[i]);
                        lstNewValues.push(this.lstValues[i]);
                    }
                }
                this.lstValues = lstNewValues;
                this.lstLabels = lstNewLabels;
            }
        },

        clearCanvasPieChart: function (canvas) {
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            if (this.pieChart != undefined)
                this.pieChart.destroy();
        },

        _getSelectedPieChartOptions: function (countainerNumberId) {
            var options = null;
            var IsDisplayLegend = $("#displayLegendPie" + countainerNumberId).prop('checked');
            if (IsDisplayLegend) {
                options = this._getOptionsObject(IsDisplayLegend);
            }
            var IsDisplayLabel = $("#displayLabels" + countainerNumberId).prop('checked');
            if (IsDisplayLabel) {
                options = this._getOptionsObject(IsDisplayLegend, IsDisplayLabel);
            }
            var DisplayCount = $("#count" + countainerNumberId).prop('checked');
            if (DisplayCount) {
                options = this._getOptionsObject(IsDisplayLegend, IsDisplayLabel, DisplayCount, false);
            } else {
                options = this._getOptionsObject(IsDisplayLegend, IsDisplayLabel, DisplayCount, true);
            }

            return options;
        },

        _getOptionsObject: function (IsShowlegand = true, IsShowLablel = false, DisplayCount = false, DisplayPresentage = false) {
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
                plugins: {},
                responsive: true,
                mainPieSize: 0,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                    display: IsShowlegand
                }
            };
            return options;
        },

        preparelist: function (selectedfield) {
            this.lstLabels = [];
            this.lstValues = [];
            for (var feature of this.featureset.features) {
                this.lstLabels.push(selectedfield);
                this.lstValues.push(feature.attributes[selectedfield]);
            }
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

        _filllistToDraw: function (selectedValue) {
            var countainerNumberId = this.getContainerNumber();
            var listgrouped = this._getGroupedlistBySelectedValue(selectedValue);
            this.lstLabels = [];
            this.lstValues = [];
            
            for (var key in listgrouped) {
                this.lstLabels.push(key);
                this.lstValues.push(listgrouped[key]);
            }
            this.sortNull(this.lstLabels);
        },

        sortNull: function () {
            var arrSoredlabel = [];
            var arrsortedvalue = [];
            for (var i = 0; i < this.lstLabels.length; i++) {

                if (this.lstLabels[i] === "null" || this.lstLabels[i] === null) {
                    arrSoredlabel.push(this.lstLabels[i]);
                    arrsortedvalue.push(this.lstValues[i]);
                } else {
                    arrSoredlabel.unshift(this.lstLabels[i]);
                    arrsortedvalue.unshift(this.lstValues[i]);
                }
            }
            this.lstLabels = arrSoredlabel;
            this.lstValues = arrsortedvalue;
        },

        onClickApply: function (event) {
            var countainerNumberId = this.getContainerNumber();
            var ddlPieChartFields = document.getElementById("ddlPieChartFields" + countainerNumberId);
            var selectedValue = ddlPieChartFields.value;
            if (selectedValue != "" && selectedValue != "0") {
                this._filllistToDraw(selectedValue);
                this.drawPieChart(countainerNumberId);
                this._getLastSelectedItems(countainerNumberId);
            }
            //set delete btn visibility for first time
            var index = event.currentTarget.id.replace(/[^0-9]/g, '');
            $('#pie_deleteItem' + index).addClass('d-none');
            //toggle modes
            this.toggleMode(countainerNumberId);
        },

        onClickReset: function () {
            var countainerNumberId = this.getContainerNumber();
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
            },
                function () {
                    _this.IsCancel = true;
                    $("#pie_edit_mode" + countainerNumberId).hide();
                    $("#pie_view_mode" + countainerNumberId).show();
                    _this._setlastSelectedItems(countainerNumberId);
                });
        },

        onClickCancel: function () {
            var countainerNumberId = this.getContainerNumber();
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
                    _this.IsCancel = true;
                    _this._setlastSelectedItems(countainerNumberId);
                    _this.toggleMode(countainerNumberId);
                });
        },

        generateColorCode: function () {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
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

        _showConfigurationMode: function () {
            var containerNumberId = this.getContainerNumber();
            $("#pie_view_mode" + containerNumberId).css("display", "none");
            $("#pie_edit_mode" + containerNumberId).css("display", "block");
        },

        onClickBack: function () {
            this._showConfigurationMode();
        },

        // #region onClickConfigrationItem
        // <summary>
        // toggle visiblty between two modes
        // </summary>
        // #endregion
        onClickConfigrationItem: function (event) {
            //extract index 
            var containerIndex = event.currentTarget.id.replace(/[^0-9]/g, '');
            this.toggleMode(containerIndex);
            $("#pie_apply_btn" + containerIndex).prop("disabled", true);
            $("#pie_reset_btn" + containerIndex).prop("disabled", true);
            $("#pie_cancel_btn" + containerIndex).prop("disabled", false);
        },

        // #region onClickDeleteItem
        // <summary>
        // delete current bar chart
        // </summary>
        // #endregion
        onClickDeleteItem: function (event) {
            var index = event.currentTarget.id.replace(/[^0-9]/g, '');
            var deletedChart = $('#ReportPieChart' + index);
            var _this = this;
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

        toggleMode: function (containerIndex) {
            // toggle modes
            $('#pie_edit_mode' + containerIndex).toggleClass('d-block');
            $('#pie_view_mode' + containerIndex).toggleClass('d-none');
            //hide title btns
            $('#pieViewMode' + containerIndex).toggleClass('d-none');
            $('#pie_deleteItem' + containerIndex).toggleClass('d-none');
        },

        _getLastSelectedItems: function (indexContainer) {
            var displaylegand = $("#displayLegendPie" + indexContainer).prop('checked');
            var displaylabel = $("#displayLabels" + indexContainer).prop('checked');
            var displayNulls = $("#piedisplayNulls" + indexContainer).prop('checked');

            var DisplayCount = $("#count" + indexContainer).prop('checked');
            this.objlastSelectedBeforeApply = {};
            this.objlastSelectedBeforeApply.displaylegand = displaylegand;
            this.objlastSelectedBeforeApply.displaylabel = displaylabel;
            this.objlastSelectedBeforeApply.displayNulls = displayNulls;
            this.objlastSelectedBeforeApply.count = DisplayCount;
            var ddlPieChartFields = document.getElementById("ddlPieChartFields" + indexContainer);
            var selectedValue = ddlPieChartFields.value;
            if (selectedValue !== "") {
                this.objlastSelectedBeforeApply.selectedValue = selectedValue;
                this.objlastSelectedBeforeApply.last = true;
            }
            this.objlastSelectedBeforeApply.lstBackgroudcolor = [];
            var _this = this;
            $.each($("#pieChartPickerColor" + indexContainer).find(".color-holder"), function () {
                $(this).css("background-color");
                _this.objlastSelectedBeforeApply.lstBackgroudcolor.push($(this).css("background-color"));
            });
        },

        _setlastSelectedItems: function (indexContainer) {
            $("#displayLegendPie" + indexContainer).prop('checked', this.objlastSelectedBeforeApply.displaylegand);
            $("#displayLabels" + indexContainer).prop('checked', this.objlastSelectedBeforeApply.displaylabel);
            $("#piedisplayNulls" + indexContainer).prop('checked', this.objlastSelectedBeforeApply.displayNulls);
            $("#count" + indexContainer).prop('checked', this.objlastSelectedBeforeApply.count);
            var ddlPieChartFields = document.getElementById("ddlPieChartFields" + indexContainer);
            ddlPieChartFields.value = this.objlastSelectedBeforeApply.selectedValue;

            $(ddlPieChartFields).change();
        }
    });
});
define(['dojo/_base/declare',
    'jimu/BaseWidget',
    './Components/ReportTitle/ReportTitle',
    './Components/ReportMap/ReportMap',
    './Components/ReportTableControl/ReportTableControl',
    './Components/ReportFeatureControl/ReportFeatureControl',
    './Components/ReportBarChart/ReportBarChart',
    './Components/ReportPieChart/ReportPieChart',
    //'./libs/jquery/jquery-3.4.1.min',
    //'./libs/bootstrap/bootstrap-4.4/js/popper.min',
    //'./libs/bootstrap/bootstrap-4.4/js/bootstrap.min',
    //'./libs/jquery-ui/jquery-ui',
    './libs/Chart.js/js/Chart.bundle',
    './libs/printThis',
    './libs/rich_text_editor/js/jquery.richtext.min',
    './libs/sweetalert/js/sweetalert.min',
    //'./libs/select2/js/select2.min',
    "dojo/domReady!"
],
    function (declare, BaseWidget,ReportTitle,ReportMap,ReportTableControl,ReportFeatureControl, ReportBarChart, ReportPieChart) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {

            // Custom widget code goes here
            // #region Global Variables
            baseClass: 'jimu-widget-ReportBuilder',
            //this property is set by the framework when widget is loaded.
            reportTitleControl: null,
            reportMapControl: null,
            reportTableControl: null,
            reportFeatureControl: null,
            loading: null,
            widgetWidth: 0,
            widgetHeight: 0,
            maxTitleLength: 50,
            data: null,
            isLandscapeMode: false,
            // #endregion

            // #region Global Functions to communicate with app container:
            postCreate: function () {
                this.inherited(arguments);
                //hide widget icon
                $("[data-widget-name='Report Builder']").hide();
                this.resize();
            },
            startup: function (e) {
                this.inherited(arguments);
                this.initializeComponents();
                this.initializeUI();
            },
            onOpen: function () {
                this.resetWidget();
                // dim print btn
                $("#btnPrint").attr('disabled', true);
            },
            onClose: function () {
                this.resetItems();
                // reset radio btns
                $("#portrait").prop('checked', true);
                $("#landscape").prop('checked', false);
            },
            resize: function () {
                this.widgetWidth = window.innerWidth - 40;
                this.widgetHeight = window.innerHeight - 40;
                $("div#widgets_ReportBuilder_panel").attr("style", "top: 10px !important;left:20px !important;width:" + this.widgetWidth + "px!important;height:" + this.widgetHeight + "px!important");
            },

            // #region intializeComponents
            // <summary>
            // intialize sub-components [map,table and featurelist] on startup reportBuilder widget
            // </summary>
            // #endregion
            initializeComponents() {
                this.reportTitleControl = new ReportTitle(
                    {
                        id: "reportTitleControl",
                        reportBuilderWidget: this
                    }, "ReportTitleComponent");
                this.reportTitleControl.startup();

                this.reportMapControl = new ReportMap(
                    {
                        id: "reportMapControl",
                        reportBuilderWidget: this,
                        legendColumnsNumber: this.isLandscapeMode ? this.config.landscapeMode.legendColumnsNumber : this.config.portraitMode.legendColumnsNumber
                    }, "ReportMapComponent");
                this.reportMapControl.startup();

                this.reportTableControl = new ReportTableControl({
                    id: "reportTableControl",
                    reportBuilderWidget: this
                }, "ReportTableControlComponent");
                this.reportTableControl.startup();

                this.reportFeatureControl = new ReportFeatureControl(
                    {
                        id: "reportFeatureControl",
                        reportBuilderWidget: this,
                        featureListColumnsNumber: this.isLandscapeMode ? this.config.landscapeMode.featureListColumnsNumber : this.config.portraitMode.featureListColumnsNumber
                    }, "ReportFeatureControlComponent");
                this.reportFeatureControl.startup();
            },

            // #region initializeUI
            // <summary>
            // intialize ui components & events on startup reportBuilder widget
            // </summary>
            // #endregion
            initializeUI: function () {
               //Toggle Mode
                $('.toggle_mode > span.swap_icon').click(function () {
                    if ($("#table_view_mode").is(":hidden")) {
                        $("#btnPrint").attr('disabled', false);
                    } else if ($("#table_view_mode").is(":visible")) {
                        $("#btnPrint").attr('disabled', true);
                    }
                    $(this).css('display', 'none');
                    $(this).siblings().css('display', 'inline-block');
                    $(this).parents('.card-header').siblings('.toggle_mode_container').children().fadeOut();
                    $($(this).data('view')).fadeIn();
                });

                //Configuration Action
                $('.toggle_mode > span.configurationItem').click(function () {
                    $(this).parent('.toggle_mode').fadeOut();
                    $(".apply-btn").prop('disabled', true);
                    $(".reset-btn").prop('disabled', true);
                    $(this).parents('.card-header').siblings('.toggle_mode_container').children().fadeOut();
                    $($(this).data('view')).fadeIn();
                    $($(this).data('view')).css({
                        'display': 'flex',
                        'flex-direction': 'column'
                    });

                    var scrollIntoView_id = $(this).parents('.scrollIntoView').attr('id');
                    document.getElementById(scrollIntoView_id).scrollIntoView();
                });

                //Delete Action
                $('.breadcrumb-item').css("cursor", "pointer");
                $(".deleteItem").click(function () {
                    $(this).parents('.col').css('display', 'none');
                    $(this).parents('.printBreakPage').css('display', 'none');
                    var itemId = $(this).parents('.col').attr('id');
                    $('.breadcrumb-item' + '-' + itemId).css("cursor", "pointer");
                    $('.breadcrumb-item' + '-' + itemId).removeClass('opacity_3');
                });

                //Tooltip
                $('[data-toggle="tooltip"]').tooltip();

                //Sortable Items @ FeatureList & Table
                $('#checkListAttributesFL').sortable();
                $('#checkListAttributes').sortable();

                //Add Clear icon to table & Feature List
                $(".input_filter_container .filter_input").on("focus", function () {
                    $(this).siblings('.filter_icon').find('i').removeClass('fa-filter').addClass('fa-times');
                });
                $(".input_filter_container .filter_input").on("focusout", function () {
                    if ($(this).val() == '') {
                        $(this).siblings('.filter_icon').find('i').removeClass('fa-times').addClass('fa-filter');
                    }
                });
                $(".input_filter_container .filter_icon").on('click', function () {
                    $(this).siblings('.filter_input').val('');
                    $(this).find('i').removeClass('fa-times').addClass('fa-filter');
                    $(this).siblings('.filter_input').trigger('keyup');
                });

                //Select2 Plugin
                $('select').select2();

                //Add Action
                $(".card-header_container .breadcrumb-item").click(function () {
                    // ================================
                    $('.printBreakPage').each(function () {
                        if ($(this).is(':hidden')) {
                            $(this).attr("style", "display:block !important;");
                        }
                    });
                    // ================
                    var item_id = $(this).data('click');
                    $(item_id).css('display', 'table');//to match new structure "table in widget.html"
                    if ($(this).hasClass('one_only')) {
                        $(this).css("cursor", "no-drop");
                        $(this).addClass('opacity_3');
                    }
                });

                this.configureComponentTitle();

                $(".main_card > .card-body").attr("style", "max-height: " + (this.widgetHeight - 132) + "px");
                $(".main_card > .card-body .card_body_child").attr("style", "max-height: " + (this.widgetHeight - 102) + "px");

                // attach events for preview & print modes
                var _this = this;
                $("input[name$='widget_view_mode']").click(function () {
                    _this.isLandscapeMode = this.id === 'landscape';
                    _this.onLayoutChange();
                });
            },

            // #region onReceiveData
            // <summary>
            // on receiveing data from another widgets query or identify ...etc
            // </summary>
            // <param name="name">           </param>
            // <param name="widgetId">       </param>
            // <param name="data">returned results from identify or query widget</param>
            // <param name="historyData">    </param>
            // <returns></returns>
            // #endregion
            onReceiveData: function (name, widgetId, data, historyData) {
                if (data.target === "ReportBuilder") {
                    // check if the data set from a query widget
                    var queryWidget = data.queryWidget;
                    if (queryWidget) {
                        var confmaxRecordsNumberstr = this.config.maxRecordsNumber;
                        if (confmaxRecordsNumberstr != "" && confmaxRecordsNumberstr != null) {
                            var confmaxRecordsNumber = parseInt(confmaxRecordsNumberstr);
                            var lstLastFeatureResult = data.featureSet.features.slice(Math.max(data.featureSet.features.length - confmaxRecordsNumber, 0));
                            data.featureSet.features = lstLastFeatureResult;
                        }
                    }
                    this.prepareDataBeforeShow(data);
                    var layerInfo = data.layerInfo;
                    var featureSet = data.featureSet;

                    this.reportMapControl.prepareExportMapTask(data);
                    this.reportMapControl.recievedDataResults = data;
                    this.reportTableControl.getData(featureSet, layerInfo);

                    this.reportFeatureControl.bindFeaturesGridData(featureSet, layerInfo);
                    this.data = data;
                    $("#reportTableControl .card-header-title").html(this.nls.table + '   (' + this.data.featureSet.features.length + ')');
                    $("#reportFeatureControl .card-header-title").html(this.nls.featureList + '   (' + this.data.featureSet.features.length + ')');
                }
            },

            prepareDataBeforeShow: function (data) {
                if (data.queryWidget) {
                    this.prepareDateForQueryResult(data);
                } else {
                    this.prepareDateForIdentifyResult(data);
                }
            },

            prepareDateForQueryResult: function (data) {
                for (var i = 0; i < data.featureSet.features.length; i++) {
                    for (var j = 0; j < data.featureSet.fields.length; j++) {
                        var field = data.featureSet.fields[j];
                        var value = data.featureSet.features[i].attributes[field.name];
                        if (field.type == "esriFieldTypeDate") {

                            if (value != null) {
                                var formatdate = this.formatDate(value);
                                data.featureSet.features[i].attributes[field.name] = formatdate;
                            }
                        }
                    }
                }
            },

            prepareDateForIdentifyResult: function (data) {
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: data.layerInfo.layerObject.url + "?f=pjson", success: function (result) {
                        var jsonArray = JSON.parse(result);
                        var fields = jsonArray.fields;
                        for (var i = 0; i < data.featureSet.features.length; i++) {
                            for (var j = 0; j < fields.length; j++) {
                                var field = fields[j];
                                var value = data.featureSet.features[i].attributes[field.name];
                                if (field.type == "esriFieldTypeDate") {

                                    if (value != null) {
                                        var formatdate = this.formatDate(value);
                                        data.featureSet.features[i].attributes[field.name] = formatdate;
                                    }
                                }
                            }

                        }
                    }
                });
            },

            formatDate: function (date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [year, month, day].join('-');
            },

            configureComponentTitle: function () {
                //prevent enter key behaviour in all components titles
                var _this = this;
                $(".card-header-title").keypress(function (event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                    }
                    return $(this).text().length <= _this.maxTitleLength;
                });
            },

            countPieChart: 0,
            onClickAddPie: function () {
                var PieChartWidget = document.createElement("div");
                PieChartWidget.id = "PieChartComponent" + this.countPieChart;
                var MainParChartDiv = document.getElementById("reportPieChart");
                MainParChartDiv.appendChild(PieChartWidget);

                var pieChart = new ReportPieChart(
                    {
                        id: "ReportPieChart" + this.countPieChart,
                        reportBuilderWidget: this,
                        count: this.countPieChart,
                        pieChartNumber: this.isLandscapeMode ? this.config.landscapeMode.pieChartNumber : this.config.portraitMode.pieChartNumber
                    }, "PieChartComponent" + this.countPieChart);

                //configration btn  visiblty hidden on edit mode
                $('#pieViewMode' + this.countPieChart).addClass('d-none');

                //check parent visiblity
                if ($('#reportPieChart').parents('.printBreakPage').is(':hidden')) {
                    $('#reportPieChart').parents('.printBreakPage').css('display', 'block');
                }

                // set chart layout
                //var landscapeChartNumber = this.config.landscapeMode.pieChartNumber;
                //var portraitChartNumber = this.config.portraitMode.pieChartNumber;
                //var landscapeColClass = "col-" + Math.floor(12 / landscapeChartNumber);
                //var portraitColClass = "col-" + Math.floor(12 / portraitChartNumber);
                //if (this.isLandscapeMode)
                //    $(".pie_item").addClass(landscapeColClass);
                //else
                //    $(".pie_item").addClass(portraitColClass);

                document.getElementById("ReportPieChart" + this.countPieChart).scrollIntoView();

                this.countPieChart++;

                pieChart.getData(this.data);

                this.configureComponentTitle();
            },

            countBarChart: 0,
            onClickAddBar: function () {
                var barChartWidget = document.createElement("div");
                barChartWidget.id = "BarChartComponent" + this.countBarChart;
                var MainParChartDiv = document.getElementById("reportBarChart");
                MainParChartDiv.appendChild(barChartWidget);
                
                var barChart = new ReportBarChart(
                    {
                        id: "ReportBarChart" + this.countBarChart,
                        reportBuilderWidget: this,
                        count: this.countBarChart,
                        barChartNumber: this.isLandscapeMode ? this.config.landscapeMode.barChartNumber : this.config.portraitMode.barChartNumber
                    }, "BarChartComponent" + this.countBarChart);

                //configration btn visiblty hidden on edit mode
                $('#barViewMode' + this.countBarChart).addClass('d-none');

                //check parent visiblity 
                if ($('#reportBarChart').parents('.printBreakPage').is(':hidden')) {
                    $('#reportBarChart').parents('.printBreakPage').css('display', 'block');
                }

                // set chart layout
                //var landscapeChartNumber = this.config.landscapeMode.barChartNumber;
                //var portraitChartNumber = this.config.portraitMode.barChartNumber;
                //var landscapeColClass = "col-" + Math.floor(12 / landscapeChartNumber);
                //var portraitColClass = "col-" + Math.floor(12 / portraitChartNumber);
                //if (this.isLandscapeMode)
                //    $(".bar_item").addClass(landscapeColClass);
                //else
                //    $(".bar_item").addClass(portraitColClass);

                document.getElementById("ReportBarChart" + this.countBarChart).scrollIntoView();

                barChart.getData(this.data, this.countBarChart);

                this.countBarChart++;

                this.configureComponentTitle();
            },

            resetItems: function () {
                document.getElementById("reportPieChart").innerHTML = "";
                document.getElementById("reportBarChart").innerHTML = "";
            },

            // #region resetWidget
            // <summary>
            // reset ui components on open reportBuilder widget
            // </summary>
            // #endregion
            resetWidget: function () {
                //reset map control 
                var applyBtn = $('#map_apply_btn');
                this.reportMapControl._focusOnViewMode(applyBtn);
                this.reportMapControl.resetConfiguration();
                // =========
                document.getElementById('reportTitleControl').scrollIntoView();
                $("#reportTableControl .toggle_mode .edit_icon").click();
                $(".richText-editor").html('');
                $("#reportMapControl .card-header-title").html(this.nls.map);
                $("#reportTableControl .card-header-title").html(this.nls.table);
                $("#reportFeatureControl .card-header-title").html(this.nls.featureList);
                $(".card-header_container .breadcrumb-item").click();
            },

            // #region onClickPrint
            // <summary>
            // on print current report preview by using browser capabilities
            // </summary>
            // #endregion
            onClickPrint: function () {
                // go to the beginning of the widget
                document.getElementById('reportTitleControl').scrollIntoView();
                // lock the report widget by displaying loader
                $('.loaderBackground').css('display', 'block');
                $('.loader').css('display', 'block');
                // prepare print template
                this.preparePrintCommonTemplate();
                if (this.isLandscapeMode === true) {
                    this.prepareLandscapeTemplate();
                } else {
                    this.preparePortraitTemplate();
                }
                //format footer date
                this._formatFooterDate();
                // call browser print widget
                this.intializePrintControl(this.isLandscapeMode);
            },

            // #region intializePrintControl
            // <summary>
            // intialize print control on click print btn
            // </summary>
            // #endregion
            intializePrintControl: function (isLandscape) {
                //  toggle between two style sheets
                var loadCSSFile;
                if (isLandscape === true) {
                    loadCSSFile = this.config.printThisLoadCssLandscapeURL;
                } else {
                    loadCSSFile = this.config.printThisLoadCssPortraitURL;
                }
                var _this = this;
                $('#divPrint').printThis({
                    debug: false,
                    importStyle: false, // import style tags
                    importCSS: true,  // import parent page css
                    loadCSS: loadCSSFile,
                    base: this.config.printThisBaseURL,
                    removeInline: false, // remove inline styles from print elements
                    removeInlineSelector: "*", // custom selectors to filter inline styles. removeInline must be true
                    printDelay: 4000, // variable print delay
                    formValues: true, // preserve input/form values
                    canvas: true, // copy canvas content
                    doctypeString: '', // enter a different doctype for older markup
                    removeScripts: false, // remove script tags from print content
                    copyTagClasses: true, // copy classes from the html & body tag
                    afterPrint: function () {
                        // function called before iframe is removed
                        // reset styles 
                        _this.resetPrintCommonTemplate();
                        _this.resetPortraitTemplate();
                        _this.resetLandscapeTemplate();
                        // hide loader 
                        $('.loaderBackground').css('display', 'none');
                        $('.loader').css('display', 'none');
                    }
                });
            },

            // #region onLandscapeMode
            // <summary>
            // toggle preview and report template between two modes
            // </summary>
            // #endregion
            onLayoutChange: function () {
                var legendColumnsNumber = this.isLandscapeMode ? this.config.landscapeMode.legendColumnsNumber : this.config.portraitMode.legendColumnsNumber;
                var featureListColumnsNumber = this.isLandscapeMode ? this.config.landscapeMode.featureListColumnsNumber : this.config.portraitMode.featureListColumnsNumber;
                //update legend layout
                this.reportMapControl.updateLayout(legendColumnsNumber);
                //update feature list layout
                this.reportFeatureControl.updateLayout(featureListColumnsNumber);
            },

            updatePieChartLayerout() {
                var landscapeChartNumber = this.config.landscapeMode.pieChartNumber;
                var portraitChartNumber = this.config.portraitMode.pieChartNumber;
                var landscapeColClass = "col-" + Math.floor(12 / landscapeChartNumber);
                var portraitColClass = "col-" + Math.floor(12 / portraitChartNumber);
                $(".pie_item").toggleClass(landscapeColClass);
                $(".pie_item").toggleClass(portraitColClass);
            },

            updateBarChartLayerout() {
                var landscapeChartNumber = this.config.landscapeMode.barChartNumber;
                var portraitChartNumber = this.config.portraitMode.barChartNumber;
                var landscapeColClass = "col-" + Math.floor(12 / landscapeChartNumber);
                var portraitColClass = "col-" + Math.floor(12 / portraitChartNumber);
                $(".bar_item").toggleClass(landscapeColClass);
                $(".bar_item").toggleClass(portraitColClass);
            },

            // #region preparePortraitTemplate
            // <summary>
            // customize headers, covers and check default cover to portrait template
            // </summary>
            // #endregion
            preparePortraitTemplate: function () {
                // display only portrait headers
                $(".printPortraitHeader").each(function () {
                    $(this).addClass("d-print-flex");
                });
                //check if cover page exist
                this._setDefaultCoverPage(this.config.printCoverImgURLPortrait);
                if (dojoConfig.locale === "ar") {
                    $('#reportMapControl').addClass("ml-5");
                    $('#printTableContainer').addClass("ml-5");
                    $('#printfeatureList').addClass("ml-5");
                    $('.printPieChart').addClass("ml-5");
                    $('.printBarChart ').addClass("ml-5");
                }
            },

            // #region prepareLandscapeTemplate
            // <summary>
            // customize headers, covers and check default cover to portrait template
            // </summary>
            // #endregion
            prepareLandscapeTemplate: function () {
                // display only landscape headers
                $(".printLandscapeHeader").each(function () {
                    $(this).addClass("d-print-flex");
                });
                //check if cover page exist
                this._setDefaultCoverPage(this.config.printCoverImgURLLandscape);
                if (dojoConfig.locale === "ar") {
                    $('#reportMapControl').addClass("ml-5 mr-2");
                    $('#printTableContainer').addClass("ml-5 mr-2");
                    $('#printfeatureList').addClass("ml-5 mr-2");
                    $('.printPieChart').addClass("ml-5");
                    $('.printBarChart ').addClass("ml-5");
                }
                else {
                    $('#printTableContainer').addClass("mr-4");
                    $('#printfeatureList').addClass("mr-4");
                    $('#reportMapControl').addClass("mr-4");
                    $('.printPieChart').addClass("mr-5");
                    $('.printBarChart ').addClass("mr-5");
                }
            },

            // #region preparePrintCommonTemplate
            // <summary>
            // customize headers, covers and check default cover to both of templates
            // </summary>
            // #endregion
            preparePrintCommonTemplate: function () {
                // check components visiblity
                if ($("#reportMap").is(':hidden')) {
                    $('#reportMap').parents('.printBreakPage').attr("style", "display:none !important;");
                }
                if ($("#reportTable").is(':hidden')) {
                    $('#reportTable').parents('.printBreakPage').attr("style", "display:none !important;");
                }
                if ($("#reportFeatureList").is(':hidden')) {
                    $('#reportFeatureList').parents('.printBreakPage').attr("style", "display:none !important;");
                }
                if ($("#reportBarChart").children(".bar_item").length === 0) {
                    $('#reportBarChart').parents('.printBreakPage').css('display', 'none');
                }
                if ($("#reportPieChart").children(".pie_item").length === 0) {
                    $('#reportPieChart').parents('.printBreakPage').css('display', 'none');
                }

                // hide components horizontal scroll
                $('.toggle_mode_container').attr("style", "overflow-y:hidden !important;");

                // hide borders on cover page 
                $('#divPrint').removeClass("border_custom_gray  border");

                // hide richtext editor in print template
                $('.richText-toolbar').addClass("d-print-none");

                // customize components classes for print template
                // view chart mode
                $('.view_mode_chart').toggleClass("p-4");

                $('.row.printBreakPage').toggleClass("px-3");
                $('.row.printBreakPage').toggleClass("px-1");

                if (this.isLandscapeMode) {
                    var landscapeBarChartNumber = this.config.landscapeMode.barChartNumber;
                    var landscapePieChartNumber = this.config.landscapeMode.pieChartNumber;
                    var landscapeBarColClass = "col-" + Math.floor(12 / landscapeBarChartNumber);
                    var landscapePieColClass = "col-" + Math.floor(12 / landscapePieChartNumber);
                    $(".pie_item, .bar_item").toggleClass("col-6");
                    $(".bar_item").toggleClass(landscapeBarColClass);
                    $(".pie_item").toggleClass(landscapePieColClass);
                }

                //map
                $('#dynamicMap').removeClass("card-img");
                $('#dynamicMap').attr("style", "width:100% !important;");

                // map legend
                $('#printMapLegendsContainer').removeClass("border-secondary");
                $('#legendContainer').attr("style", "border-top:2px solid #b7b7b7; !important;");
                $('#legendContainer').toggleClass("card-footer_map");
                $('#legendContainer li').toggleClass("list-group-item");

                // multi
                //$('.toggle_mode_container, #QueryGridFeatureResult').removeClass("border");

                $('.printMapSubContainer, .printPieChart, #printfeatureList').toggleClass("card");

                $('#reportPieChart, #reportBarChart').addClass("mr-5 ml-4");

                // table
                $('#printTableContainer').removeClass("card my-3");
                $('#attrTable').addClass("w-100");
                $('#attrTable').removeClass("table table-striped");

                // featureList
                $('#reportFeatureList').removeClass("col");
                $("#QueryGridFeatureResult fieldset table").each(function () {
                    $(this).removeClass("table table-striped");
                    $(this).addClass("fieldListTable w-100");
                });
                $("#QueryGridFeatureResult fieldset").each(function () {
                    $(this).attr("style", "margin-top:10px !important;");
                });
            },

            // #region resetPortraitTemplate
            // <summary>
            // reset styles customizations of portrait template
            // </summary>
            // #endregion
            resetPortraitTemplate: function () {
                // display only portrait headers
                $(".printPortraitHeader").each(function () {
                    $(this).removeClass("d-print-flex");
                });
                $('#reportMapControl').removeClass("ml-5");
                $('#printTableContainer').removeClass("ml-5");
                $('#printfeatureList').removeClass("ml-5");
                $('.printPieChart').removeClass("ml-5");
                $('.printBarChart ').removeClass("ml-5");
            },

            // #region resetLandscapeTemplate
            // <summary>
            // reset styles customizations of landscape template
            // </summary>
            // #endregion
            resetLandscapeTemplate: function () {
                // display only landscape headers
                $(".printLandscapeHeader").each(function () {
                    $(this).removeClass("d-print-flex");
                });
                $('#printTableContainer').removeClass("mr-4 ml-5");
                $('#printfeatureList').removeClass("mr-4 ml-5");
                $('#reportMapControl').removeClass("mr-4 ml-5");
                $('.printPieChart').removeClass("mr-5 ml-5");
                $('.printBarChart ').removeClass("mr-5 ml-5");
            },

            // #region resetPrintCommonTemplate
            // <summary>
            // reset styles customizations common between templates
            // </summary>
            // #endregion
            resetPrintCommonTemplate: function () {
                // show components horizontal scroll
                $('.toggle_mode_container').attr("style", "overflow-y:auto !important;");

                // hide borders on cover page 
                $('#divPrint').addClass("border_custom_gray  border");

                // remove components customizations classes for preview mode
                // view mode
                $('.view_mode_chart').toggleClass("p-4");

                $('.row.printBreakPage').toggleClass("px-3");
                $('.row.printBreakPage').toggleClass("px-1");
                // map 
                $('#dynamicMap').addClass("card-img");
                $('#dynamicMap').css("width", "");

                // map legend
                $('#printMapLegendsContainer').addClass("border-secondary");
                $('#legendContainer').toggleClass("card-footer_map");
                $('#legendContainer li').toggleClass("list-group-item");

                // charts layout
                if (this.isLandscapeMode) {
                    var landscapeBarChartNumber = this.config.landscapeMode.barChartNumber;
                    var landscapePieChartNumber = this.config.landscapeMode.pieChartNumber;
                    var landscapeBarColClass = "col-" + Math.floor(12 / landscapeBarChartNumber);
                    var landscapePieColClass = "col-" + Math.floor(12 / landscapePieChartNumber);
                    $(".pie_item, .bar_item").toggleClass("col-6");
                    $(".pie_item, .bar_item").toggleClass(landscapePieColClass);
                }

                // multi
                $('.printMapSubContainer, .printPieChart, #printfeatureList').toggleClass("card");
                $('#reportPieChart, #reportBarChart').removeClass("mr-5 ml-4");

                // table
                $('#printTableContainer').addClass("card my-3");
                // $('#attrTable').addClass("w-100");
                $('#attrTable').addClass("table table-striped");

                // featureList
                $('#QueryGridFeatureResult').removeClass("mr-5"); //?
                $('#reportFeatureList').addClass("col");
                $("#QueryGridFeatureResult fieldset table").each(function () {
                    $(this).addClass("table table-striped");
                    $(this).removeClass("fieldListTable w-100");
                });
            },

            // #region _setDefaultCoverPage
            // <summary>
            // check existance of cover and set default cover page
            // </summary>
            // #endregion
            _setDefaultCoverPage: function (fileName) {
                $('#printImgLandscapeHeader, #printImgLandscapeCover, #printImgPortraitHeader, #printImgPortraitCover').removeClass("d-print-flex");
                var http = new XMLHttpRequest();
                http.open('HEAD', fileName, false);
                http.send();

                var headerID, coverID;
                if (this.isLandscapeMode === true) {
                    headerID = '#printImgLandscapeHeader';
                    coverID = '#printImgLandscapeCover';
                } else {
                    headerID = '#printImgPortraitHeader';
                    coverID = '#printImgPortraitCover';
                }

                if (http.status === 200) {
                    $(coverID).addClass("d-print-flex");
                    $(headerID).removeClass("d-print-flex");
                } else {
                    $(coverID).removeClass("d-print-flex");
                    $(headerID).addClass("d-print-flex");
                }
            },

            // #region _formatFooterDate
            // <summary>
            // set and split date format of template page footer with translation
            // </summary>
            // #endregion
            _formatFooterDate: function () {
                var copyThis = this;
                Date.prototype.getFormatDate = function () {
                    var monthNames = copyThis.nls.monthNames;
                    monthNames = monthNames.split(',');
                    var month = monthNames[this.getMonth()];
                    month = month.replace(/['"]+/g, '');
                    return this.getDate() + ' ' + month + ', ' + this.getFullYear();
                };
                $("#datepg1").text(new Date().getFormatDate());
            },
            // #endregion
        });
    });
define([
    "dijit/_WidgetBase", "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin", "dojo/Evented", "dojo/_base/declare",
    "dojo/_base/lang", "dojo/text!./ReportMap.html",
    'esri/tasks/PrintTask', 'esri/tasks/PrintParameters',
    'esri/tasks/PrintTemplate', 'esri/config',
    "esri/graphicsUtils",
    'jimu/dijit/LoadingIndicator', "dojo/_base/connect",
    "esri/layers/FeatureLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/graphic",
    "esri/Color"
], function (_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented, declare, lang, dijitTemplate, PrintTask, PrintParameters,
        PrintTemplate, esriConfig, graphicsUtils, LoadingIndicator, dojo, FeatureLayer, SimpleMarkerSymbol, SimpleLineSymbol,
        SimpleFillSymbol, Graphic, Color) {

        return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented],
            {
                // #region Global Variables
                declaredClass: "ReportMap.ReportMapModule",
                templateString: dijitTemplate,
                widgetObject: null,
                appConfig: null,
                config: null,
                map: null,
                nls: null,
                exportedMapFormats: [],
                exportedMapLayouts: [],
                featureSetExtent: null,
                currentMapExtent: null,
                currentLayer: null,
                loading: null,
                recievedDataResults: null,
                currentFeatureLayer: null,
                printFeatureLayer: null,
                lstvisableLayersId: [],
                lastExtentBeforeOpen: null,
                lastOriginExtentStatus: true,
                lastLegendDisplayStatus: true,
                legendColNumber: 0,
                // #endregion

                constructor: function (options) {
                    this.widgetObject = options.reportBuilderWidget;
                    this.appConfig = options.reportBuilderWidget.appConfig;
                    this.config = options.reportBuilderWidget.config;
                    this.map = options.reportBuilderWidget.map;
                    this.nls = options.reportBuilderWidget.nls;
                    this.legendColNumber = options.legendColumnsNumber;
                    this.exportedMapFormats = ["jpg", "png32", "png8", "pdf", "gif", "eps", "svg", "svgz"];
                    this.exportedMapLayouts = ["MAP_ONLY", "A4 Portrait", "A4 Landscape", "A3 Landscape", "A3 Portrait",
                        "Letter ANSI A Landscape", "Letter ANSI A Portrait", "Tabloid ANSI B Landscape", "Tabloid ANSI B Portrait"];
                },

                startup: function () {
                    console.log('start map component');
                    this.intializeEvents();
                },

                onClose: function () {
                    $("#overlay").hide();
                },

                destroy: function () {
                    this.inherited(arguments);
                },

                // #region intializeEvents
                // <summary>
                // intialize events on startup map component 
                // </summary>
                // #endregion
                intializeEvents: function () {
                    // trigger map extent changing 
                    this.currentMapExtent = this.map.extent;
                    dojo.connect(this.map, "onExtentChange", lang.hitch(this, function (currentExtent) {
                        this.currentMapExtent = currentExtent;
                    }));

                    $("#displayLegend").change(function () {
                        $("#reportMapControl .apply-btn").prop('disabled', false);
                        $("#reportMapControl .reset-btn").prop('disabled', false);
                    });

                    $("#reportMapControl input:radio").change(function () {
                        $("#reportMapControl .apply-btn").prop('disabled', false);
                        $("#reportMapControl .reset-btn").prop('disabled', false);
                    });

                    // configure apply btn
                    $('#map_apply_btn').on('click', lang.hitch(this, function () {
                        $("#btnPrint").attr('disabled', true);
                        this.lastLegendDisplayStatus = $("#displayLegend")[0].checked;
                        if (($("#displayLegend")[0].checked !== this.lastLegendDisplayStatus) && (this.lastOriginExtentStatus === $("#displayOriginalExtent")[0].checked)) {
                            this._setLegendVisiblty();
                            $("#btnPrint").removeAttr("disabled");

                        } else if (($("#displayLegend")[0].checked === this.lastLegendDisplayStatus) && (this.lastOriginExtentStatus === $("#displayOriginalExtent")[0].checked)) {
                            this._setLegendVisiblty();
                            $("#btnPrint").removeAttr("disabled");
                        } else {
                            this.prepareExportMapTask(this.recievedDataResults);
                        }
                        // toggle to view mode
                        var applyBtn = $('#map_apply_btn');
                        this._focusOnViewMode(applyBtn);
                    }));

                    // configure reset btn
                    $('#map_reset_btn').on('click', lang.hitch(this, function () {
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
                                _this._saveLastConfigrations();
                                $("#reportMapControl .apply-btn").prop('disabled', true);
                                $("#reportMapControl .reset-btn").prop('disabled', true);
                            });
                    }));

                    // configure cancel btn
                    $('#map_cancel_btn').on('click', lang.hitch(this, function () {
                        var cancelBtn = $('#map_cancel_btn');
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
                                _this._saveLastConfigrations();
                                _this._focusOnViewMode(cancelBtn);
                            });
                    }));
                },

                // #region _setLegendVisiblty
                // <summary>
                // toggle and set legend visiblty
                // </summary>
                // #endregion
                _setLegendVisiblty: function () {
                    if ($("#displayLegend").is(':checked')) {
                        $("#legendContainer").css('display', 'block');
                    } else { $("#legendContainer").css('display', 'none'); }
                },

                // #region _saveLastConfigrations
                // <summary>
                // keep the last saved configrations
                // </summary>
                // #endregion
                _saveLastConfigrations: function () {
                    if (this.lastLegendDisplayStatus === true) {
                        $("#displayLegend").prop('checked', true);
                    } else {
                        $("#displayLegend").prop('checked', false);
                    }
                    if (this.lastOriginExtentStatus === true) {
                        $("#displayOriginalExtent").prop('checked', true);
                    } else {
                        $("#displayCurrentExtent").prop('checked', true);
                    }
                },

                // #region _focusOnViewMode
                // <summary>
                // toggle between view and configration mode
                // </summary>
                // <param name="element">dom element of event </param>
                // #endregion
                _focusOnViewMode: function (element) {
                    $(element).parents('.edit_mode').fadeOut();
                    $(element).parents('.edit_mode').siblings('.view_mode').fadeIn();
                    $(element).parents('.toggle_mode_container').siblings('.card-header').find('.toggle_mode').fadeIn();
                    document.getElementById('reportMapControl').scrollIntoView();
                },

                // #region prepareExportMapTask
                // <summary>
                // preparing print task params & conditions
                // </summary>
                // <param name="dataResults">returned results from identify or query widget </param>
                // <returns></returns>
                // #endregion
                prepareExportMapTask: function (dataResults) {
                    this.lastExtentBeforeOpen = this.map.extent;
                    this.recievedDataResults = dataResults;
                    // hide map image & legend
                    $("#dynamicMap").css('display', 'none');
                    $("#legendContainer").css('display', 'none');
                    // loading show
                    $('.loaderBackground').css('display', 'block');
                    $('.loader').css('display', 'block');
                    // set exported map extent
                    // check if more than one feature get legend layers
                    this.setFeatureSetExtent(graphicsUtils, dataResults);
                    if (dataResults.queryWidget) {
                        //when open Report Builder widger from query widget 
                        this.prepareMapForPrint(dataResults);
                        var featureLayerId = this.map.layerIds.filter(function (webMapLayerId) {
                            return dataResults.queryWidget.singleQueryResult.currentAttrs.config.webMapLayerId.indexOf(webMapLayerId) != -1;
                        })[0];
                        this.currentFeatureLayer = this.map.getLayer(featureLayerId);
                        this.currentLayer = this.currentFeatureLayer.url;
                    } else {
                        this.currentLayer = dataResults.layerInfo.parentLayerInfo.layerObject.url;
                    }
                    // prepare legend ===========================================================
                    var currentLayerID = dataResults.layerInfo.layerObject.layerId;
                    this.getAllLayersLegends(this.currentLayer, currentLayerID, this.legendColNumber);
                    // ==========================================================================
                    if (dataResults.featureSet.features.length > 1) {
                        // prepare exported map extent
                        this.map.setExtent(this.featureSetExtent);
                    } else if (dataResults.featureSet.features.length === 1) {
                        this._addGraphicOnIdentify(dataResults);
                    }
                    // ======= check extent
                    if ($("#displayCurrentExtent").is(':checked')) {
                        this.lastOriginExtentStatus = false;
                        this.map.setExtent(this.currentMapExtent);
                    } else if ($("#displayOriginalExtent").is(':checked')) {
                        this.lastOriginExtentStatus = true;
                        if (dataResults.featureSet.features[0].geometry.type != "point")
                            this.map.setExtent(this.featureSetExtent.expand(1.5));
                    }
                    // #region dpi comments
                    // height 842 width 595 72
                    // 400 and 700 for landscape
                    // execute printTask 
                    // ToDo: change dbi and image type to png
                    // this.exportedMapFormats[0,1,2] jpg,png32,png8 , this.exportedMapLayouts[0,1,2] //map only,portrait,landscape
                    // for imgs dpi with hight&width https://www.papersizes.org/a-sizes-in-pixels.htm
                    //400,700 portrait
                    // 1123 794  landscape
                    //400, 800
                    // #endregion
                    this.exportCurrentMap(this.map,355,800,96, this.exportedMapFormats[0], this.exportedMapLayouts[0], lang.hitch(this, function onSuccuess(results) {
                        //set image url
                        $("#dynamicMap").attr("src", results.url);
                        // check if legend checked 
                        if ($("#displayLegend").is(':checked')) {
                            this.lastLegendDisplayStatus = true;
                            $("#legendContainer").css('display', 'block');
                        } else {
                            this.lastLegendDisplayStatus = false;
                            $("#legendContainer").css('display', 'none');
                        }
                        $('.loaderBackground').css('display', 'none');
                        $('.loader').css('display', 'none');
                        $("#dynamicMap").css('display', 'block');
                        $("#btnPrint").removeAttr("disabled");
                        $("#chxExportCurrentMap").removeClass("d-none");
                        this.map.setExtent(this.lastExtentBeforeOpen);
                        this.map.graphics.clear();
                        if (this.printFeatureLayer && this.currentFeatureLayer) {
                            this.currentFeatureLayer.setVisibleLayers(this.lstvisableLayersId);
                            this.map.removeLayer(this.printFeatureLayer);
                        }
                    }), lang.hitch(this, function onFail(error) { console.log(error); }));
                },

                // #region exportCurrentMap
                // <summary>
                // execute print task function
                // </summary>
                // <param1 name="mapExtent">extent will appear in map result</param>
                // <param2 name="imgHeight">height of map result</param>
                // <param3 name="imgWidth">width of map result</param>
                // <param4 name="resolution">dpi quality of map result</param>
                // <param5 name="format">format of map results such as jpg,png ..etc</param>
                // <param6 name="layout">layout of map results such as a4,a3 ..etc</param>
                // <param7 name="successFunction">success callback function</param>
                // <param9 name="errorFunction">fail callback function</param>
                // <returns>Map URL</returns>
                // #endregion
                exportCurrentMap: function (mapExtent, imgHeight, imgWidth, resolution, format, layout, successFunction, errorFunction) {
                    // enable cors to current task url
                    esriConfig.defaults.io.proxyUrl = "/proxy/";
                    // prepare print templates
                    this.printTemplate = new PrintTemplate();
                    // check layout
                    if (layout === "MAP_ONLY") {
                        this.printTemplate.exportOptions = {
                            width: imgWidth,
                            height: imgHeight,
                            dpi: resolution
                        };
                    }
                    this.printTemplate.format = format;
                    this.printTemplate.layout = layout;
                    this.printTemplate.preserveExtent = true;
                    this.printTemplate.showAttribution = true;
                    this.printTemplate.preserveScale = false;
                    this.printParams = new PrintParameters();
                    this.printParams.template = this.printTemplate;
                    this.printParams.map = mapExtent;
                    this.printParams.outSpatialReference = mapExtent.spatialReference;

                    // prepare print task
                    this.printTask = new PrintTask(this.widgetObject.config.exportWebMapServiceURL, this.printParams);
                    var _this = this;
                    setTimeout(function () {
                        _this.printTask.execute(_this.printParams, successFunction, errorFunction);
                    }, 1000);
                },

                updateDefinitionExpression(layer, definitionExpression) {
                    layer.setDefinitionExpression(definitionExpression);
                    this.map.infoWindow.hide();
                },

                setFeatureSetExtent: function (graphicsUtils, dataResults) {
                    this.featureSetExtent = graphicsUtils.graphicsExtent(dataResults.featureSet.features);
                },

                prepareMapForPrint: function (dataResults) {
                    var where = dataResults.queryWidget.singleQueryResult.currentAttrs.query.where;
                    var url = dataResults.queryWidget.singleQueryResult.currentAttrs.config.url;
                    var webMapLayerId = dataResults.queryWidget.singleQueryResult.currentAttrs.config.webMapLayerId;
                    this.printFeatureLayer = new FeatureLayer(url, {
                        //set the definition expression 
                        mode: FeatureLayer.MODE_AUTO,
                        defaultDefinitionExpression: where,
                        visible: true,
                        id: "forPrint"
                    });
                    var featureLayerId = this.map.layerIds.filter(function (webMapLayerId) {
                        return dataResults.queryWidget.singleQueryResult.currentAttrs.config.webMapLayerId.indexOf(webMapLayerId) != -1;
                    })[0];
                    this.map.addLayer(this.printFeatureLayer);
                    this.currentFeatureLayer = this.map.getLayer(featureLayerId);
                    this.lstvisableLayersId = [];
                    this.lstvisableLayersId = this.currentFeatureLayer.visibleLayers;
                    var lstVisableFeatureLayer = this.currentFeatureLayer.visibleLayers.filter(function (id) {
                        return dataResults.queryWidget.singleQueryResult.currentAttrs.layerInfo.id != id
                            && id >= 0;
                    });
                    this.updateDefinitionExpression(this.printFeatureLayer, where);
                    this.currentFeatureLayer.setVisibleLayers(lstVisableFeatureLayer);
                    this.currentFeatureLayer.refresh();
                    if (dataResults.layerInfo) {
                        var graphiclayerhide = this.map.getLayer(dataResults.layerInfo.id);
                        graphiclayerhide.setVisibility(false);
                    }
                },

                _addGraphicOnIdentify: function (dataResults) {
                    this.map.graphics.clear();
                    var graphic = dataResults.featureSet.features[0];
                    graphic.id = dataResults.featureSet.features[0].attributes["OBJECTID"];
                    var type = graphic.geometry.type;
                    var symbol = this._getSymbolByType(type);
                    if (graphic.geometry.type == "point") {
                        this.map.setScale(1000);
                        this.map.centerAt(graphic.geometry);
                    }
                    this.map.graphics.add(new Graphic(graphic.geometry, symbol));
                },

                // #region _getSymbolByType
                // <summary>
                // create graphic symbol per type passed as aparam
                // </summary>
                // <param name="type">type of graphic symbol</param>
                // <returns>drawn symbol per tybe passed</returns>
                // #endregion
                _getSymbolByType(type) {
                    var symbol;
                    switch (type) {
                        case "point":
                        case "multipoint":
                            symbol = new SimpleMarkerSymbol({
                                "color": null,
                                "size": 10,
                                "angle": 40,
                                "xoffset": 0,
                                "yoffset": 0,
                                "type": "esriSMS",
                                "style": "esriSMSSquare",
                                "outline":
                                {
                                    "color": [102, 255, 255, 255],
                                    "width": 3,
                                    "type": "esriSLS",
                                    "style": "esriSLSSolid"
                                }
                            });
                            break;
                        case "polyline":
                            symbol = new SimpleLineSymbol({
                                type: "simple-line",
                                color: [102, 255, 255, 255],
                                width: 3
                            });
                            break;
                        default:
                            symbol = new SimpleFillSymbol();
                            symbol.setColor(null);
                            symbol.setStyle(SimpleFillSymbol.STYLE_NULL);
                            symbol.setOutline(new SimpleLineSymbol(
                                SimpleLineSymbol.STYLE_SOLID,
                                new Color([102, 255, 255, 255]), 3));
                            break;
                    }
                    return symbol;
                },

                // #region getAllLayersLegends
                // <summary>
                // get all legend of services
                // </summary>
                // <param name="currentLayerUrl">data LayerUrl</param>
                // <param name="currentLayerId">data Layer Index or ID</param>
                // <returns>Array of legends</returns>
                // #endregion
                getAllLayersLegends: function (currentLayerUrl, currentLayerId, legendColNo) {
                    //calculate legend class
                    var legendItemWidthClass = Math.floor(12 / legendColNo);
                    legendItemWidthClass = "col-" + legendItemWidthClass;

                    $('#legendContainer').html('');
                    var legendRequetURL = currentLayerUrl + "/legend?f=pjson";
                    $.get(legendRequetURL, function (json) {
                        json['layers'].forEach(function (layer) {
                            if (layer.layerId === currentLayerId) {
                                // display legend on 4 or 5 coulmns grid per portrait or landscape mode selected
                                var quotient = Math.floor(layer.legend.length / legendColNo);
                                var reminder = layer.legend.length % legendColNo;
                                var listCount = 0; //no of uls
                                reminder === 0 ? listCount = quotient : listCount = quotient + 1;

                                var count = 0; //counter of legends
                                for (var i = 0; i < listCount; i++) {
                                    $('#legendContainer').append('<ul class="row list-group px-0 list-group-horizontal" id="legendListGroup' + i + '"></ul>');
                                    var url;
                                    var legendName; var img; var listItem;
                                    var listGroupID = "legendListGroup" + i;

                                    var k = legendColNo; //no of li inside every ul
                                    while (k > 0) {
                                        if (count === layer.legend.length) { break; }
                                        url = layer.legend[count].url;
                                        legendName = layer.legend[count].label;
                                        if (legendName !== "<all other values>") {
                                            img = currentLayerUrl + '/' + layer.layerId + '/images/' + url;
                                            listItem = '<li class="' + legendItemWidthClass +' list-group-item p-0 d-flex border-0 mb-2 mb-md-0"><span class=" h-50"><img src="' + img + '"></span><span class="h-50 text-muted font_size_14 mx-1 mt-1">' + legendName + '</span></li>';
                                            $('#' + listGroupID).append(listItem);
                                            k = k - 1;
                                        }
                                        count = count + 1;
                                    }
                                }
                            }
                        });
                    }, "json");
                    $("#legendContainer").css('display', 'none');
                },

                // #region updateLayout
                // <summary>
                // create graphic symbol per type passed as aparam
                // </summary>
                // #endregion
                updateLayout: function (legendColumnsNumber) {
                    // hide map image & legend
                    $("#dynamicMap").css('display', 'none');
                    $("#legendContainer").css('display', 'none');
                    // loading show
                    $('.loaderBackground').css('display', 'block');
                    $('.loader').css('display', 'block');
                    // go to the beginning of the widget
                    document.getElementById('reportTitleControl').scrollIntoView();
                    // call legend ================================================
                    var currentLayerID = this.recievedDataResults.layerInfo.layerObject.layerId;
                    this.getAllLayersLegends(this.currentLayer, currentLayerID, legendColumnsNumber);
                    var _this = this;
                    setTimeout(function () {
                        _this._setLegendVisiblty();
                        $('.loaderBackground').css('display', 'none');
                        $('.loader').css('display', 'none');
                        $("#dynamicMap").css('display', 'block');
                    }, 3000);
                },

                // #region onClickDeleteBtn
                // <summary>
                // hide the current map component
                // </summary>
                // #endregion
                onClickDeleteBtn: function () {
                    var itemId = 'reportMap';
                    $('#' + itemId).css('display', 'none');
                    $('.breadcrumb-item' + '-' + itemId).css("cursor", "pointer");
                    $('.breadcrumb-item' + '-' + itemId).removeClass('opacity_3');
                },

                // #region resetConfiguration
                // <summary>
                // reset map configrations to the default
                // </summary>
                // #endregion
                resetConfiguration: function () {
                    $("#displayLegend").prop('checked', true);
                    $("#displayOriginalExtent").prop('checked', true);
                }
            });
    });




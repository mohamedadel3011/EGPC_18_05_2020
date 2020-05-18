define([
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/on",
    "dojo/text!./ReportFeatureControl.html",
], function (_WidgetBase,
    _OnDijitClickMixin,
    _TemplatedMixin,
    Evented,
    declare,
    on,
    dijitTemplate) {
        return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented], {
            declaredClass: "ReportFeatureControl.ReportFeatureControlModule",
            templateString: dijitTemplate,
            options: { map: null},
            lstConfigs: [],
            fieldInfos: [],
            fieldsName: [],
            currentfieldsName: [],
            compareFieldsName: [],
            fieldsDisplayName: [],
            listOrganizedQuery: [],
            features: [],
            lastselectedInfoFields: [],
            lastselectedOrderChecklist: [],
            displayNulls: true,
            nls: null,

            constructor: function (options) {
                declare.safeMixin(this.options, options);
                this.set("map", this.options.map);
                this.nls = options.reportBuilderWidget.nls;
                this.featureListColumnsNumber = options.featureListColumnsNumber;
            },

            startup: function () {
                console.log('start widget');
            },

            destroy: function () {
                this.inherited(arguments);
            },

            bindFeaturesGridData: function (featureSet, layerInfo) {
                // reset controls
                $("#txtFilterAttributesFL").val("");
                $('#txtFilterAttributesFL').trigger('keyup');
                $("#featureListSelectAll").prop('checked', false);
                $("#featureListdisplayNulls").prop('checked', true);
                $("#featurelist_edit_mode").hide();
                $("#featurelist_view_mode").show();
                $('#reportFeatureList .toggle_mode').fadeIn();

                // get visible fields
                this.lstConfigs = layerInfo.layerObject.infoTemplate.info.fieldInfos.filter(function (event) {
                    return event.visible === true;
                });
                //this.listOrganizedQuery = this.makelistOfObjectQueryTask(data);
                this.features = featureSet.features;
                this.fieldInfos = layerInfo.layerObject.infoTemplate.info.fieldInfos;
                this.fieldsName = this.lstConfigs.map(x => x.fieldName);
                this.currentfieldsName = this.fieldsName;
                this.fieldsDisplayName = this.lstConfigs.map(x => x.label);

                this.listOrganizedQuery = this.preparelistObject(this.features, this.fieldsName);
                this.drawBox(this.listOrganizedQuery);
                this.initConfigurationSetting();
                this._getlastSelectedOrderChecklist();
            },

            updateLayout: function (featureListColumnsNumber) {
                this.featureListColumnsNumber = featureListColumnsNumber;
                this.drawBox(this.listOrganizedQuery);
            },

            // we make it like that for each Query task and idetify becasue we want to show alias in key not name
            //in identify in default show alias but in Qurey task show name by default you need to get alias from alias attributs
            makelistOfObjectQueryTask: function (result) {
                this.features = result.features;
                var fieldAliases = result.fieldAliases;
                if (fieldAliases === null) {
                    fieldAliases = result.fields;
                }
                var list = [];
                for (var feature of this.features) {
                    var lstFieldValue = [];
                    for (var key of Object.keys(feature.attributes)) {
                        var Field = {};
                        var configfield = this.getVisableByAttributeByKey(this.lstConfigs, key);
                        if (typeof configfield !== 'undefined') {
                            Field.Key = configfield.label;
                            Field.Value = feature.attributes[key];
                            if (configfield.visible) {
                                lstFieldValue.push(Field);
                            }
                        }
                    }
                    list.push(lstFieldValue);
                }
                return list;
            },

            preparelistObject: function (features, fields) {
                var list = [];
                for (var feature of features) {
                    var lstFieldValue = [];
                    for (var key of fields) {
                        var Field = {};
                        var configfield = this.getVisableByAttributeByKey(this.fieldInfos, key);
                        if (typeof configfield !== 'undefined') {
                            Field.Key = configfield.label;
                            Field.Value = feature.attributes[key];
                            lstFieldValue.push(Field);
                        }
                    }
                    list.push(lstFieldValue);
                }
                return list;
            },

            getAliasByName: function (fieldAliases, Name) {
                if (typeof fieldAliases !== 'object') {
                    for (let field of fieldAliases) {
                        if (field.name === Name) {
                            return field.alias;
                        }
                    }
                }
                else {
                    return fieldAliases[Name];
                }
            },

            getVisableByAttributeByKey: function (lst, key) {
                for (var i = 0; i < lst.length; i++) {
                    if (lst[i].fieldName === key) {
                        return lst[i];
                    }
                }
            },
            getArabicNumbers: function (str) {
                var map = ["&\#1632;", "&\#1633;", "&\#1634;", "&\#1635;", "&\#1636;", "&\#1637;", "&\#1638;", "&\#1639;", "&\#1640;", "&\#1641;"];

                var newStr = "";
                str = String(str);
                for (i = 0; i < str.length; i++) {
                    newStr += map[parseInt(str.charAt(i))];
                }
                return newStr;
            },

            drawBox: function (listBoxes) {
                var ResultDivBase = document.getElementById("QueryGridFeatureResult");
                ResultDivBase.innerHTML = "";
                var count = 1;
                var colspan = "";
                var remainingFields = 0;
                for (let feature of listBoxes) {
                    var resultObjectfieldset = document.createElement("fieldset");
                    resultObjectfieldset.className = "border border-secondary rounded px-2 ";

                    var legandFeaturelist = document.createElement("legend");
                    legandFeaturelist.className = "font_size_14 font-weight-bold text-dark_red w-auto px-2 ml-2";
                    //debugger;
                    //if (dojoConfig.locale === "ar") {
                    //    count = this.getArabicNumbers(count);
                    //}
                    legandFeaturelist.innerHTML = this.nls.feature + count;
                    var ulfeaturelist = document.createElement("table");
                    ulfeaturelist.className = "table table-sm table-striped font_size_14";
                    var fieldValue = '';
                    if (!$("#featureListdisplayNulls").is(':checked'))
                        feature = this.removeNullAttributes(feature);
                    remainingFields = feature.length % this.featureListColumnsNumber;
                    colspan = "";
                    var colClass = "custom-col-" + (this.featureListColumnsNumber * 2);
                    for (var index = 0; index < feature.length; index += this.featureListColumnsNumber) {
                        const element = feature[index];
                        var fieldswithValue = document.createElement("tr");
                        fieldswithValue.className = "rounded";
                        fieldValue = (element.Value === null) ? '' : element.Value;
                        if (remainingFields === 1 && (index + 1) === feature.length)
                            colspan = "colspan=" + ((this.featureListColumnsNumber - remainingFields) * 2 + 1);

                        fieldswithValue.innerHTML = '<th class="text-dark font-weight-bold ' + colClass + '">' + element.Key + ' :</th><td class=" ' + colClass + '" ' + colspan + '>' + fieldValue + '</td>';
                        for (var i = 1; i < this.featureListColumnsNumber; i++) {
                            if (index + i < feature.length) {
                                fieldValue = (feature[index + i].Value === null) ? '' : feature[index + i].Value;
                                if (remainingFields === (i + 1) && (index + i + 1) === feature.length)
                                    colspan = "colspan=" + (((this.featureListColumnsNumber - i - 1) * 2) + 1);
                                fieldswithValue.innerHTML += '<th class="text-dark font-weight-bold ' + colClass + '">' + feature[index + i].Key + ' :</th><td class=" ' + colClass + '" ' + colspan + '>' + fieldValue + '</td>';
                            }
                        }
                        ulfeaturelist.appendChild(fieldswithValue);
                    }
                    resultObjectfieldset.appendChild(legandFeaturelist);
                    resultObjectfieldset.appendChild(ulfeaturelist);
                    ResultDivBase.appendChild(resultObjectfieldset);
                    count++;
                }
            },

            removeNullAttributes: function (feature) {
                var nonNullableAttributes = [];
                feature.forEach(function (attribute) {
                    if (attribute.Value)
                        nonNullableAttributes.push(attribute);
                });
                return nonNullableAttributes;
            },

            //this Function Created to onBtnConfigurationSettingClick..
            initConfigurationSetting: function () {
                this._filter();
                this.drawCheckBoxsList(this.fieldInfos);
                this.currentfieldsName = this._getSelectedChecked();
                $("#featureListSelectAll").change(function () {
                    if ($("#featureListSelectAll").is(':checked')) {
                        $("input.attribute-checkboxFL").prop('checked', true);
                        $("#reportFeatureList .apply-btn").prop('disabled', false);
                    }
                    else {
                        $("input.attribute-checkboxFL").prop('checked', false);
                        $("#reportFeatureList .apply-btn").prop('disabled', true);
                    }
                });
            },

            //this Function Created to filter On Checkboxes...
            _filter: function () {
                $("#txtFilterAttributesFL").val('');
                $("#txtFilterAttributesFL").on("keyup", function () {
                    var value = $(this).val().toLowerCase();
                    $(".attribute-checkListFL").filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                    });
                });
            },

            //this Function Created to Draw CheckBoxs List...
            drawCheckBoxsList: function (checkBoxsList) {
                var checkListAttributesDiv = document.getElementById("checkListAttributesFL");
                checkListAttributesDiv.innerHTML = '';
                for (var i = 0; i < checkBoxsList.length; i++) {
                    var divmain = document.createElement("div");
                    divmain.className = "attribute-checkListFL custom-control custom-checkbox col-md-4 " + this.nls.padding_x_0_reverse + " mb-2 " + this.nls.padding_x_3;
                    //--------------------
                    //Created By UI
                    var divCheckContainer = document.createElement("div");
                    divCheckContainer.className = "divCheckContainer " + this.nls.divCheckContainer_local + " position-relative border rounded p-2 h-100";
                    divmain.appendChild(divCheckContainer);
                    //--------------------
                    var checkBox = document.createElement("input");
                    //To Create Auto Checked Checkboxes Visible Equal True...
                    if (checkBoxsList[i].visible === true) {
                        checkBox.checked = true;
                    }
                    checkBox.type = "checkbox";
                    checkBox.id = "checkboxFieldNameFL" + i;
                    checkBox.value = checkBoxsList[i].fieldName;
                    checkBox.className = "attribute-checkboxFL custom-control-input";
                    on(checkBox, 'change', this.onSelectedChecklistItem);
                    //divmain.appendChild(checkBox);
                    divCheckContainer.appendChild(checkBox); //UI
                    var label = document.createElement("label");
                    label.className = "custom-control-label " + this.nls.custom_control_label_local + " font-weight-bold font_size_14 text-muted " + this.nls.padding_x_4 + "";
                    label.setAttribute("for", "checkboxFieldNameFL" + i);
                    //divmain.appendChild(label);
                    divCheckContainer.appendChild(label); //UI
                    label.appendChild(document.createTextNode(checkBoxsList[i].label));
                    checkListAttributesDiv.appendChild(divmain);
                }
                $("#reportFeatureList input:checkbox").change(function () {
                    $("#reportFeatureList .reset-btn").prop('disabled', false);
                    if ($("input.attribute-checkboxFL:checkbox:checked").length > 1)
                        $("#reportFeatureList .apply-btn").prop('disabled', false);
                    else
                        $("#reportFeatureList .apply-btn").prop('disabled', true);

                });
            },

            //this Function Created to get Displayed Fields In Customed Table...
            _getDisplayedFieldsInCustomedTable: function () {
                this.fieldsName = [];
                this.fieldsDisplayName = [];
                var _this = this;
                $.each($("input.attribute-checkboxFL:checkbox:checked"), function () {
                    _this.fieldsName.push($(this).val());
                    _this.fieldsDisplayName.push($(this).next('label').text());
                });
            },

            _getSelectedChecked: function () {
                var list = [];
                $.each($("input.attribute-checkboxFL:checkbox:checked"), function () {
                    list.push($(this).val());
                });
                return list;
            },

            onApplyBtnClick: function () {
                this._getDisplayedFieldsInCustomedTable();
                this.currentfieldsName = this.fieldsName;
                this.displayNulls = $("#featureListdisplayNulls").is(':checked');
                if (this.fieldsName.length === 0) {
                    swal("Please select at least one attribute!", "", "error");
                    // Change This Part By Sweetalert...
                } else {
                    $('#reportFeatureList .toggle_mode').fadeIn();
                    $("#printfeatureList .toggle_mode .edit_icon").click();
                    $("#featurelist_edit_mode").hide();
                    $("#featurelist_view_mode").show();
                    this.restControls();
                    document.getElementById('printfeatureList').scrollIntoView();
                    this._getselectedfieldInfoByfieldName(this.fieldsName);
                    this._getlastSelectedOrderChecklist();
                    this.listOrganizedQuery = [];
                    this.listOrganizedQuery = this.preparelistObject(this.features, this.fieldsName);
                    this.drawBox(this.listOrganizedQuery);
                }
            },

            _getselectedfieldInfoByfieldName: function (selectedfields) {
                this.lastselectedInfoFields = [];
                for (var i = 0; i < selectedfields.length; i++) {
                    var getfieldInfo = this.fieldInfos.filter(function (field) {
                        return field.fieldName === selectedfields[i];
                    });
                    this.lastselectedInfoFields.push(getfieldInfo[0]);
                }
            },

            _updateselectedCheckBox: function (lstNames) {
                $.each($("input.attribute-checkboxFL"), function () {
                    var value = $(this).val();
                    var lastselected = lstNames.filter(function (field) {
                        return field === value;
                    });
                    if (lastselected[0]) {
                        $(this).prop('checked', true);
                    } else {
                        $(this).prop('checked', false);

                    }
                });
                $("#reportFeatureList .reset-btn").prop('disabled', true);
                $("#reportFeatureList .apply-btn").prop('disabled', true);
            },

            _getlastSelectedOrderChecklist: function () {
                var _this = this;
                this.lastselectedOrderChecklist = [];
                $.each($("input.attribute-checkboxFL"), function () {
                    var value = $(this).val();

                    var getfieldInfo = _this.fieldInfos.filter(function (field) {
                        return field.fieldName === value;
                    });
                    if (getfieldInfo[0]) {
                        _this.lastselectedOrderChecklist.push(getfieldInfo[0]);
                    }
                });
            },

            onResetBtnClick: function () {
                var _this = this;
                this.compareFieldsName = this._getSelectedChecked();
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
                        if (_this.lastselectedOrderChecklist && _this.lastselectedOrderChecklist.length > 0) {
                            _this.drawCheckBoxsList(_this.lastselectedOrderChecklist);
                        }
                        _this._updateselectedCheckBox(_this.fieldsName);
                        _this.restControls();
                    });
            },

            onCancelBtnClick: function () {
                var _this = this;
                this.compareFieldsName = this._getSelectedChecked();
                swal({
                    title: this.nls.textCancelConfigurationswal,
                    text: this.nls.textrestConfigurationswal,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: this.nls.confirmButtonTextswal,
                    cancelButtonText: this.nls.cancelButtonTextswal,
                    closeOnConfirm: true
                }, function () {
                    $("#featurelist_edit_mode").hide();
                    $("#featurelist_view_mode").show();
                    $('#reportFeatureList .toggle_mode').fadeIn();
                    _this.restControls();
                    if (_this.lastselectedOrderChecklist && _this.lastselectedOrderChecklist.length > 0) {
                        _this.drawCheckBoxsList(_this.lastselectedOrderChecklist);
                    }
                    _this._updateselectedCheckBox(_this.fieldsName);
                });
            },

            restControls: function () {
                $("#txtFilterAttributesFL").val("");
                $('#txtFilterAttributesFL').trigger('keyup');
                $("#featureListSelectAll").prop('checked', false);
                $("#featureListdisplayNulls").prop('checked', this.displayNulls);
            },

            onClickDeleteBtn: function () {
                var itemId = 'reportFeatureList';
                $('#' + itemId).css('display', 'none');
                $('.breadcrumb-item' + '-' + itemId).css("cursor", "pointer");
                $('.breadcrumb-item' + '-' + itemId).removeClass('opacity_3');
            }
        });
    });
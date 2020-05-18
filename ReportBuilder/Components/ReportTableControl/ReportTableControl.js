define([
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/on",
    "dojo/text!./ReportTableControl.html",
], function (_WidgetBase,
    _OnDijitClickMixin,
    _TemplatedMixin,
    Evented,
    declare,
    on,
    dijitTemplate) {
    return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented], {
        declaredClass: "ReportTableControl.ReportTableControlModule",
        templateString: dijitTemplate,
        options: { map: null },
        select: null,
        tableData: [],
        fieldInfos: [],
        fieldsName: [],
        currentFieldsName: [],
        compareFieldsName: [],
        selectedGroupByField: 0,
        isChanged: false,
        fieldsDisplayName: [],
        nls: null,
        lastSelectedOrderChecklist: [],
        groupByList: [],

        constructor: function (options) {
            declare.safeMixin(this.options, options);
            this.set("map", this.options.map);
            this.nls = options.reportBuilderWidget.nls;
        },

        startup: function () { },

        destroy: function () {
            this.inherited(arguments);
        },

        getData: function (featureSet, layerInfo) {
            //reset controls
            $("#txtFilterAttributes").val("");
            $('#txtFilterAttributes').trigger('keyup');
            $("#table_edit_mode").hide();
            $("#table_view_mode").show();
            $('#reportTable .toggle_mode').fadeIn();

            //Get Table Data ..
            this.tableData = [];
            for (var i = 0; i < featureSet.features.length; i++) {
                this.tableData.push(featureSet.features[i].attributes);
            }
            //Sort Data Of Table
            this.tableData.sort(function (a, b) { return a < b ? -1 : 1 });
            //Get Headers(object) Names in Table when Visible Equal True.
            this.fieldInfos = layerInfo.layerObject.infoTemplate.info.fieldInfos;
            this.fieldsName = layerInfo.layerObject.infoTemplate.info.fieldInfos.filter(function (event) {
                return event.visible === true;
            }).map(x => x.fieldName);
            this.currentFieldsName = this.fieldsName;
            this.fieldsDisplayName = layerInfo.layerObject.infoTemplate.info.fieldInfos.filter(function (event) {
                return event.visible === true;
            }).map(x => x.label);

            this.drawTable(this.fieldsName, this.fieldsDisplayName, this.tableData, null);
            this.initConfigurationSetting();
        },

        drawTable: function (fieldsName, fieldsDisplayName, tableData, groupByField) {
            $('#attrTable').empty();
            var displyedFieldsLength = fieldsName.length;
            // to create table header img
            var headerImg = '<tr class="d-none d-print-flex"><th class=""  colspan="' + displyedFieldsLength + '"><div class=""><img src="./widgets/ReportBuilder/images/Header_Portrait.jpg" class="d-none d-print-flex" /></div></th></tr>';
            if (displyedFieldsLength > 0) {
                var table = '<thead class="thead-light text-center font_size_16">' + '<tr class="printCustomHeader">';
                if (displyedFieldsLength > 10) {
                    displyedFieldsLength = 10;
                }
                // draw Table Header... 
                for (var i = 0; i < displyedFieldsLength; i++) {
                    table += '<th scope="col">' + fieldsDisplayName[i] + '</th>';
                }
                table += '</tr></thead><tbody class="font_size_14">';
                // Check if this groupByField has data or not (It has data  Enter In Groupe by Section Here) ..
                if (groupByField !== null) {
                    for (var j = 0; j < tableData.length; j++) {
                        table += `<tr><td class='text-uppercase font-weight-bold px-3' colspan="${fieldsName.length}">${tableData[j].group}</td></tr>`;
                        if (tableData[j].attrs)
                            tableData[j].attrs.forEach(e => {
                                table += "<tr>";
                                var fieldValue = '';
                                for (var k = 0; k < displyedFieldsLength; k++) {
                                    fieldValue = (e[fieldsName[k]] === null) ? '' : e[fieldsName[k]];
                                    table += "<td>" + fieldValue + "</td>";
                                }
                                table += "</tr>";
                            });
                    }
                }
                //draw Table Body ...
                else {
                    tableData.forEach(e => {
                        table += "<tr>";
                        var fieldValue = '';
                        for (var k = 0; k < displyedFieldsLength; k++) {
                            fieldValue = (e[fieldsName[k]] === null) ? '' : e[fieldsName[k]];
                            table += "<td>" + fieldValue + "</td>";
                        }
                        table += "</tr>";
                    });
                }
                table += "</tbody>";
                document.getElementById("attrTable").innerHTML = table;
            }
        },

        //this Function Created to custom Configuration...
        customConfiguration: function () {
            var _this = this;
            var groupSelected = [...new Set(_this.tableData.map(e => e[this.ddlGroupByAttribute.value]))];//uniqe groupSelected names
            groupSelected.sort(function (a, b) { return a < b ? -1 : 1; });
            this.groupByList = groupSelected.map(e => ({ group: e, attrs: _this.tableData.filter(x => x[this.ddlGroupByAttribute.value] === e) }));
        },

        //this Function Created to Draw DropDownList Fields...
        drawDropDownListFields: function (dropDownListFields) {
            this.ddlGroupByAttribute = document.getElementById("ddlGroupByAttribute");
            this.ddlGroupByAttribute.innerHTML = "";
            var el = document.createElement("option");
            el.textContent = this.nls.DDLDefaultValue;
            el.value = 0;
            this.ddlGroupByAttribute.appendChild(el);
            for (var i = 0; i < dropDownListFields.length; i++) {
                el = document.createElement("option");
                el.textContent = dropDownListFields[i].label;
                el.value = dropDownListFields[i].fieldName;
                this.ddlGroupByAttribute.appendChild(el);
            }
            $("#ddlGroupByAttribute").change(function () {
                $("#reportTable .apply-btn").prop('disabled', false);
                $("#reportTable .reset-btn").prop('disabled', false);
            });
        },

        //this Function Created to Draw CheckBoxs List...
        drawCheckBoxsList: function (checkBoxsList) {
            var counter = 0;
            var checkListAttributesDiv = document.getElementById("checkListAttributes");
            checkListAttributesDiv.innerHTML = '';
            for (var i = 0; i < checkBoxsList.length; i++) {
                var divmain = document.createElement("div");
                divmain.className = "attribute-checkList custom-control custom-checkbox col-md-4 " + this.nls.padding_x_0_reverse + " mb-2 " + this.nls.padding_x_3;
                //--------------------
                //Created By UI
                var divCheckContainer = document.createElement("div");
                divCheckContainer.className = "divCheckContainer " + this.nls.divCheckContainer_local + " position-relative border rounded p-2 h-100";
                divmain.appendChild(divCheckContainer);
                //--------------------
                var checkBox = document.createElement("input");
                //To Create Auto Checked Checkboxes Visible Equal True...
                if (counter < 10 && checkBoxsList[i].visible === true) {
                    counter += 1;
                    checkBox.checked = true;
                }
                checkBox.type = "checkbox";
                checkBox.id = "checkboxFieldName" + i;
                checkBox.value = checkBoxsList[i].fieldName;
                checkBox.className = "attribute-checkbox custom-control-input";
                on(checkBox, 'change', this.onSelectedChecklistItem);
                divCheckContainer.appendChild(checkBox); //UI
                var label = document.createElement("label");
                label.className = "custom-control-label " + this.nls.custom_control_label_local + " font-weight-bold font_size_14 text-muted " + this.nls.padding_x_4 + "";
                label.setAttribute("for", "checkboxFieldName" + i);
                divCheckContainer.appendChild(label); //UI
                label.appendChild(document.createTextNode(checkBoxsList[i].label));
                checkListAttributesDiv.appendChild(divmain);
            }

            $("input.attribute-checkbox:checkbox").change(function () {
                $("#reportTable .reset-btn").prop('disabled', false);
                if ($("input.attribute-checkbox:checkbox:checked").length > 1)
                    $("#reportTable .apply-btn").prop('disabled', false);
                else
                    $("#reportTable .apply-btn").prop('disabled', true);

            });
        },

        //this Function Created to filter On Checkboxes...
        _filter: function () {
            $("#txtFilterAttributes").val('');
            $("#txtFilterAttributes").on("keyup", function () {
                var value = $(this).val().toLowerCase();
                $(".attribute-checkList").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        },

        _getSelectedChecked: function () {
            var list = [];
            $.each($("input.attribute-checkbox:checkbox:checked"), function () {
                list.push($(this).val());
            });
            return list;
        },

        //this Function Created to get Displayed Fields In Customed Table...
        _getDisplayedFieldsInCustomedTable: function () {
            this.fieldsName = [];
            this.fieldsDisplayName = [];
            var _this = this;
            $.each($("input.attribute-checkbox:checkbox:checked"), function () {
                _this.fieldsName.push($(this).val());
                _this.fieldsDisplayName.push($(this).next('label').text());
            });
        },

        //this Function Created to onBtnConfigurationSettingClick..
        initConfigurationSetting: function () {
            this._filter();
            this.drawDropDownListFields(this.fieldInfos);
            this.drawCheckBoxsList(this.fieldInfos);
            this.currentFieldsName = this._getSelectedChecked();
        },

        onSelectedChecklistItem: function (event) {
            this.isChanged = true;
        },

        updateSelectedCheckBox(lstNames) {
            $.each($("input.attribute-checkbox"), function () {
                var value = $(this).val();
                var lastSelected = lstNames.filter(function (field) {
                    return field === value;
                });
                if (lastSelected[0]) {
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                }
            });
            $("#reportTable .apply-btn").prop('disabled', true);
            $("#reportTable .reset-btn").prop('disabled', true);
        },

        _getLastSelectedOrderChecklist: function () {
            var _this = this;
            this.lastSelectedOrderChecklist = [];
            $.each($("input.attribute-checkbox"), function () {
                var value = $(this).val();

                var getfieldInfo = _this.fieldInfos.filter(function (field) {
                    return field.fieldName === value;
                });
                if (getfieldInfo[0]) {
                    _this.lastSelectedOrderChecklist.push(getfieldInfo[0]);
                }
            });
        },

        //this Function Created to onBtnApplyClick...
        onApplyBtnClick: function () {
            this._getDisplayedFieldsInCustomedTable();
            this.selectedGroupByField = this.ddlGroupByAttribute.value;
            this.currentFieldsName = this.fieldsName;
            if (this.fieldsName.length > 10) {
                swal(
                    this.nls.ApplyBtnClickTableValidateMaxNumberFieldp1 + this.fieldsName.length + this.nls.ApplyBtnClickTableValidateMaxNumberFieldp2,
                    this.nls.ApplyBtnClickTableValidateMaxNumberFieldp3,
                    "error");
            } else if (this.fieldsName.length === 0) {
                swal(this.nls.MsgVaildateNumberChecks);
            } else {
                $('#reportTable .toggle_mode').fadeIn();
                $("#table_edit_mode").hide();
                $("#table_view_mode").show();
                $("#txtFilterAttributes").val("");
                $('#txtFilterAttributes').trigger('keyup');
                document.getElementById('reportTableControl').scrollIntoView();
                this._getLastSelectedOrderChecklist();
                if (this.ddlGroupByAttribute.selectedIndex !== 0) {
                    this.customConfiguration();
                    this.drawTable(this.fieldsName, this.fieldsDisplayName, this.groupByList, 1);
                } else {
                    this.drawTable(this.fieldsName, this.fieldsDisplayName, this.tableData, null);
                }
            }
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
                    _this.updateSelectedCheckBox(_this.currentFieldsName);
                    $("#txtFilterAttributes").val("");
                    $('#txtFilterAttributes').trigger('keyup');
                    _this.ddlGroupByAttribute.value = _this.selectedGroupByField;
                    if (_this.lastSelectedOrderChecklist && _this.lastSelectedOrderChecklist.length > 0) {
                        _this.drawCheckBoxsList(_this.lastSelectedOrderChecklist);
                    }
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
            },
                function () {
                    $("#table_edit_mode").hide();
                    $("#table_view_mode").show();
                    $('#reportTable .toggle_mode').fadeIn();
                    $("#txtFilterAttributes").val("");
                    $('#txtFilterAttributes').trigger('keyup');
                    $("#featureListSelectAll").prop('checked', false);
                    _this.updateSelectedCheckBox(_this.currentFieldsName);
                    _this.ddlGroupByAttribute.value = _this.selectedGroupByField;
                    if (_this.lastSelectedOrderChecklist && _this.lastSelectedOrderChecklist.length > 0) {
                        _this.drawCheckBoxsList(_this.lastSelectedOrderChecklist);
                    }
                });
        },

        onClearSelectionClick: function (evt) {
            $.each($("input.attribute-checkbox"), function () {
                $(this).prop('checked', false);
            });
            $("#reportTable .apply-btn").prop('disabled', true);
            $("#reportTable .reset-btn").prop('disabled', false);
            evt.preventDefault();
        },

        onClickDeleteBtn: function () {
            var itemId = 'reportTable';
            $('#' + itemId).css('display', 'none');
            $('.breadcrumb-item' + '-' + itemId).css("cursor", "pointer");
            $('.breadcrumb-item' + '-' + itemId).removeClass('opacity_3');
        }
    });
});
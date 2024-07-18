sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/viz/ui5/controls/VizFrame",
    "sap/ui/core/UIComponent",
    "sap/viz/ui5/controls/Popover",
    "sap/m/PageAccessibleLandmarkInfo", // Por ejemplo, una dependencia de SAPUI5
   

  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
   
    Controller,
    VizFrame,
    MessageToast,
    JSONModel,
    UIComponent,
    FlattenedDataset,
    Popover,
    FeedItem,
    DateFormat,
    PageAccessibleLandmarkInfo
  ) {
    "use strict";

    return Controller.extend("solicitudproyect.controller.View1", {
      onInit: function () {
   
        var info = new PageAccessibleLandmarkInfo();

        var oModel2 = new sap.ui.model.json.JSONModel();
        oModel2.loadData("./model/selectData.json");
        this.getView().setModel(oModel2, "ModeloSelect");
        this.getView().getModel("ModeloSelect");

        var oModel3 = new sap.ui.model.json.JSONModel();
        oModel3.loadData("./model/smartData.json");
        this.getView().setModel(oModel3, "smartDatos");
        this.getView().getModel("smartDatos");

        var oModel4 = new sap.ui.model.json.JSONModel();
        oModel3.loadData("./model/data.json");
        this.getView().setModel(oModel3, "smartDatos");
        this.getView().getModel("tableData");

        /*  var oModel3 = new sap.ui.model.json.JSONModel();
            oModel3.loadData("./model/smartData.json");
            this.getView().setModel(oModel3);*/

        /* var url = 'webapp/model/data.json';
                       $.ajax({
                            url:   url,
                            dataType: "json",
                            cache: false,
                            success: function(data){
                                myModel.setData(data);
                            },
                            error: function( jqXHR, textStatus, errorThrown){
                                alert("does not exist " + textStatus.toString());
                            }
                        });*/
      },

      //Boton mensaje-- ejemplo
      onPress: function (oEvent) {
        // alert("boton pulsado")
        MessageToast.show(oEvent.getSource().getId() + "PResionado");
      },

      onNavToView1: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        // Agrega un punto de interrupción aquí para verificar que oRouter y this estén definidos correctamente
        console.log("Navigating to View1");

        oRouter.navTo("app");
      },

      //-------------- Funcion  completamente rellenar panel 1 ----------------------------------------

      onSubmit: function () {
        var oView = this.getView();
        var aPanelIds = ["panel1", "panel2", "panel3", "panel4"]; // Añade todos los IDs de los paneles aquí
        var bAllPanelsCompleted = true;

        aPanelIds.forEach(function (sPanelId) {
          var oFormPanel = oView.byId(sPanelId);

          if (oFormPanel) {
            // Obtener todos los campos de entrada, selección y fecha dentro del contenedor
            var aFields = oFormPanel
              .findElements(true /* recurse */)
              .filter(function (oElement) {
                return (
                  oElement instanceof sap.m.Input ||
                  oElement instanceof sap.m.Select ||
                  oElement instanceof sap.m.DatePicker
                ); // Filtrar controles de entrada, selección y fecha
              });

            // Verificar si todos los campos tienen valores
            var bAllFieldsFilled = aFields.every(function (oField) {
              var sValue = "";
              if (oField instanceof sap.m.Input) {
                sValue = oField.getValue();
              } else if (oField instanceof sap.m.Select) {
                sValue = oField.getSelectedKey();
              } else if (oField instanceof sap.m.DatePicker) {
                sValue = oField.getDateValue()
                  ? oField.getDateValue().toISOString()
                  : ""; // Convertir la fecha a un formato de cadena
              }
              if (!sValue) {
                oField.setValueState(sap.ui.core.ValueState.Error); // Establecer estado de error si el campo está vacío
              } else {
                oField.setValueState(sap.ui.core.ValueState.None); // Restablecer estado si el campo está completado
              }
              return sValue; // Comprobar si el valor del campo no está vacío
            });

            if (!bAllFieldsFilled) {
              bAllPanelsCompleted = false;
            }
          }
        });

        if (bAllPanelsCompleted) {
          // Acción cuando todos los paneles están completos
          MessageToast.show("Todos los campos tienen que estar completos.");
          //alert("Todos los campos tienen que estar completos. " + textStatus.toString());
        } else {
          // Mostrar un mensaje de error si algún campo de algún panel está vacío
          MessageToast.show(
            "Por favor, completa todos los campos de todos los paneles."
          );
          //alert("Todos los campos tienen que estar completos. ");
        }
      },

      //------------------------------------------------------

      //-------------- Funcion fechas dinamicas con tabla ---------------------------------------

      fechasDinamicas: function (oEvent) {
        // Obtener las fechas seleccionadas de los DatePickers
        var startDatePicker = this.getView().byId("date_inico");
        var endDatePicker = this.getView().byId("date_fin");

        // Comprobar si los DatePickers tienen valores seleccionados
        if (!startDatePicker || !endDatePicker) {
          console.error("Error: No se pudieron obtener los DatePickers.");
          return;
        }

        var startDate = startDatePicker.getDateValue();
        var endDate = endDatePicker.getDateValue();

        // Si las fechas no están definidas, salir de la función
        if (!startDate || !endDate) {
          console.log("Esperando a que se seleccionen ambas fechas.");
          return;
        }

        // Calcular el número de meses en el rango
        var diffMonths = this.getMonthsDifference(startDate, endDate);

        // Generar dinámicamente las columnas de la tabla
        var oTable = this.getView().byId("table_dimicFecha");
        var totalColumnIndex = this.findTotalColumnIndex(oTable);

        if (totalColumnIndex === -1) {
          console.error("Error: No se encontró la columna 'Total'.");
          return;
        }

        // Eliminar las columnas dinámicas existentes después de "Total"
        var columnCount = oTable.getColumns().length;
        for (var j = columnCount - 1; j > totalColumnIndex; j--) {
          oTable.removeColumn(j);
        }

        // Agregar nuevas columnas
        for (var i = 0; i <= diffMonths; i++) {
          var columnDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + i,
            1
          );
          var year = columnDate.getFullYear();
          var month = columnDate.toLocaleString("default", { month: "long" }); // Obtener el nombre del mes en letras
          var columnHeaderText = year + "-" + month;
          var oColumn = new sap.m.Column({
            header: new sap.m.Label({ text: columnHeaderText }),
            width: "100px", // Ajustar el ancho de la columna según sea necesario
          });
          oTable.insertColumn(oColumn, totalColumnIndex + 1 + i);
        }

        // Ajustar el ancho de la tabla y habilitar el desplazamiento horizontal
        var oScrollContainer = this.getView().byId("scroll_container");
        oScrollContainer.setHorizontal(true);
        oScrollContainer.setVertical(false);
        oScrollContainer.setWidth("100%");

        console.log("startDate:", startDate);
        console.log("endDate:", endDate);
      },

      findTotalColumnIndex: function (oTable) {
        var columns = oTable.getColumns();
        for (var i = 0; i < columns.length; i++) {
          var headerLabel = columns[i].getHeader();
          if (headerLabel && headerLabel.getText() === "Total") {
            return i;
          }
        }
        return -1; // No se encontró la columna 'Total'
      },

      getMonthsDifference: function (startDate, endDate) {
        var diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        diffMonths -= startDate.getMonth();
        diffMonths += endDate.getMonth();
        return diffMonths;
      },

      //-----------------------------------------------------------------------

      //----------------Funcion CheckBox -------------------------------------------
      onSelectCheckbox: function (oEvent) {
        var oTable = this.byId("table2");
        var aColumns = oTable.getColumns();
        var aItems = oTable.getItems();
        var bSelected = oEvent.getSource().getSelected();
        var iSelectedColumnIndex = oEvent
          .getSource()
          .getParent()
          .getParent()
          .indexOfColumn(oEvent.getSource().getParent());

        // IDs of the checkboxes
        var sOtherCheckboxId =
          iSelectedColumnIndex === 0 ? "box_prove" : "box_condi";
        var oOtherCheckbox = this.byId(sOtherCheckboxId);

        // Disable the other checkbox if this one is selected, enable if deselected
        oOtherCheckbox.setEnabled(!bSelected);

        // Loop through each column and set the editable state of inputs in that column
        aColumns.forEach(function (oColumn, iColumnIndex) {
          aItems.forEach(function (oItem) {
            var oInput = oItem.getCells()[iColumnIndex];
            // Set editable state to true only for the selected column
            oInput.setEditable(
              iColumnIndex === iSelectedColumnIndex ? bSelected : !bSelected
            );
          });
        });
      },

      //--------------------------------------------------------------------------------

      //-------------- Get Inputs -------------------------------------------------------
      onInputChange: function () {
        // Capturar valores de los inputs y selects
        var sCodeValue = this.byId("input0").getValue();
        var sNombrePro = this.byId("input1").getValue();

        //Get select
        var oSelect = this.byId("slct_inic");
        var sSelectValue = oSelect.getSelectedItem()
          ? oSelect.getSelectedItem().getText()
          : "";
        var oSelect1 = this.byId("slct_Jefe");
        var sSelectValue1 = oSelect1.getSelectedItem()
          ? oSelect1.getSelectedItem().getText()
          : "";
        var oSelect2 = this.byId("slct_area");
        var sSelectValue2 = oSelect2.getSelectedItem()
          ? oSelect2.getSelectedItem().getText()
          : "";
        var oSelect3 = this.byId("slct_clFun");
        var sSelectValue3 = oSelect3.getSelectedItem()
          ? oSelect3.getSelectedItem().getText()
          : "";

        //Get Fechas

        var ostartDatePicker = this.byId("date_inico");
        var sStartDatePicker = ostartDatePicker.getDateValue();
        var sFormattedDateIni = sStartDatePicker
          ? DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(
              sStartDatePicker
            )
          : "";

        var oDatePicker = this.byId("date_fin");
        var sDateValue = oDatePicker.getDateValue();
        var sFormattedDate = sDateValue
          ? DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(
              sDateValue
            )
          : "";

        // Actualizar las celdas de la tabla con los valores capturados
        this.byId("txt_codig").setText(sCodeValue);
        this.byId("txt_nomPro").setText(sNombrePro);
        this.byId("txt_ini").setText(sSelectValue);
        this.byId("txt_NomJefe").setText(sSelectValue1);
        this.byId("txt_funcio").setText(sSelectValue3);
        this.byId("txt_area").setText(sSelectValue2);
        this.byId("txt_feIni").setText(sFormattedDateIni);
        this.byId("txt_feFin").setText(sFormattedDate);
      },

      //-------------------------------------------------------------

      handleInformation: function (oEvent) {
        if (!this.newInformationDialog) {
          this.newInformationDialog = sap.ui.xmlfragment(
            "solicitudproyect.view.ViewInfo",
            this
          );
          this.getView().addDependent(this.newInformationDialog);
        }
        this.newInformationDialog.open();
      },

      handleButtonCancel: function (oEvent) {
        this.newInformationDialog.close();
      },
    });
  }
);

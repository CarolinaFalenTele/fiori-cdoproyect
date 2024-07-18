sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
  ],
  function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("solicitudproyect.controller.App", {
      onInit: function () {

        
        var oModel4 = new sap.ui.model.json.JSONModel();
        oModel4.loadData("./model/data.json");
        this.getView().setModel(oModel4, "ListaCdo");
        this.getView().getModel("ListaCdo");

      },



      onNavToView1: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        // Agrega un punto de interrupción aquí para verificar que oRouter y this estén definidos correctamente
        console.log("Navigating to View1");

        oRouter.navTo("view");
      },
    });
  }
);

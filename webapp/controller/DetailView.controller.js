sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Fragment, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("app.jsonminingb27.controller.DetailView", {
        onInit() {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onRouteMatched, this)
            var oModel = new JSONModel();
            oModel.loadData("/model/MockData/miningData.json")
            this.getView().setModel(oModel, 'MiningModel');
        },

        onRouteMatched: function(oEvent) {

            let index = oEvent.getParameter("arguments").index
            let sPath = "MiningModel>/miningListSet/" + index
            let oView = this.getView()
            oView.bindElement(sPath)
        },

        onF4Help: function(oEvent) {
            this.inputFiled = oEvent.getSource().getId()
            let oModel = this.getView().getModel("MiningModel")
            let aData = oModel.getProperty("/miningSupplier")
            let deepCopy = JSON.parse(JSON.stringify(aData))
            let oModelFrag = new JSONModel({
                newSuppSet: deepCopy
            })
            if (!this.oDiolog) {
                this.oDiolog = Fragment.load({
                    fragmentName: "app.jsonminingb27.fragments.popUp",
                    controller: this
                }).then((dialog) => {
                    this.oDiolog = dialog
                    this.getView().addDependent(this.oDiolog)
                    this.getView().setModel(oModelFrag, "FragmentModel")
                    this.oDiolog.open()
                })
            } else {
                this.oDiolog.open()
            }
        },

        onFilter: function() {
            let aFilter = []
            let sName = this.getView().byId("idInputSupp").getValue()
            let sCity = this.getView().byId("idInputCity").getValue()
            if (sName) {
                let filterName = new Filter("Contractor_Name", FilterOperator.Contains, sName)
                aFilter.push(filterName)
            }
            if (sCity) {
                let filterCity = new Filter("Location", FilterOperator.Contains, sCity)
                aFilter.push(filterCity)
            }
            let oTable = this.getView().byId("idMTable")
            let bindingInfo = oTable.getBinding("items")
            bindingInfo.filter(aFilter);
        },

        onConfirmSupplier: function(oEvent) {
            let oSelectedItems = oEvent.getParameter("selectedItem")
            let sValue = oSelectedItems.getProperty("info")
            let oInput = sap.ui.getCore().byId(this.inputFiled)
            oInput.setValue(sValue)
        },

        onListView: function() {
            let oRouter = this.getOwnerComponent().getRouter()
            // use the navigation method
            oRouter.navTo("RouteMiningView")
        }

    });
});
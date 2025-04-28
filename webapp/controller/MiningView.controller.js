sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,JSONModel, Sorter, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("app.jsonminingb27.controller.MiningView", {
        onInit() {
            var oModel = new JSONModel();
            oModel.loadData("/model/MockData/miningData.json")
            this.getView().setModel(oModel, 'MiningModel');
        },

        onSort: function() {
            if (!this.bDescending) {
                this.bDescending = false;
            }
            var oSorter = new Sorter("Type_of_Mineral", this.bDescending);
            var oList = this.getView().byId("idmining");
            var oBinding = oList.getBinding("items");
            oBinding.sort(oSorter);
            this.bDescending = !this.bDescending;
        },

        onSearch: function(oEvent) {
            var searchString = oEvent.getParameter("query") || oEvent.getParameter("newValue");
            var oName = new Filter("idmining", FilterOperator.Contains, searchString);
            var oAvail = new Filter("Type_of_Mineral", FilterOperator.Contains, searchString);
            var aFilter = [oName, oAvail];
            var mainFilter = new Filter({
                filters: aFilter,
                and: false
            });
            var oList = this.getView().byId("idmining");
            var oBinding = oList.getBinding("items");
            oBinding.filter(mainFilter);

        },
        onScrollToTop: function() {
            var oScrollContainer = this.getView().byId("scrollContainer");
            oScrollContainer.scrollTo(0, 0); // Scroll to the top of the container
        },
 
        onScrollToBottom: function() {
            var oScrollContainer = this.getView().byId("scrollContainer");
            oScrollContainer.scrollTo(0, oScrollContainer.getDomRef().scrollHeight); // Scroll to the bottom of the container
        },


        onItemSelect: function(oEvent) {
            var oList = oEvent.getParameter("listItem");
            var sPath = oList.getBindingContextPath();
            let aItems = sPath.split("/")
            let id = aItems[aItems.length - 1]

            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDetailView", {
                index: id
            })
        }
    });
});
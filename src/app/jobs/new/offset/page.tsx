"use client";

import { OffsetPrintForm } from "@/components/forms/OffsetPrintForm";

export default function OffsetPrintPage() {
  const initialFormData = {
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    deliveryDate: "",
    jobNumber: "",
    jobName: "",
    quantity: 0,
    jobType: "offset",
    notes: "",
    paperSupplyByCustomer: false,
    paperCuttingByCustomer: false,
    paperType: {
      type: "",
      size: "",
      weight: "",
      finish: "",
      grain: "",
    },
    colors: {
      cyan: false,
      magenta: false,
      yellow: false,
      black: false,
      fireRed: false,
      royalBlue: false,
      green: false,
      orange: false,
      violet: false,
      purple: false,
      chocolateBrown: false,
      coffeeBrown: false,
      merun: false,
      goldenYellow: false,
      gold: false,
      silver: false,
      customColor: false,
      customColorValue: "",
    },
    paperItems: [],
    printingMethod: {
      paperSize: "",
      width: 0,
      height: 0,
      qty: 0,
      printingSystem: "",
      printImpression: {
        value1: 0,
        value2: 0,
        result: 0,
      },
    },
    laminating: {
      type: "none",
      size: {
        height: 0,
        width: 0,
      },
      qty: 0,
      unitPrice: 0,
      result: 0,
    },
    dieCut: {
      cutter: {
        newCutter: false,
        oldCutter: false,
        creasing: false,
        perforating: false,
        embossing: false,
        debossing: false,
      },
      impression: {
        qty: 0,
        unitPrice: 0,
        result: 0,
      },
    },
    billBook: {
      numberOfPapers: 1,
      papers: [],
      details: {
        billNumbers: "",
        bookNumbers: "",
        sets: 0,
        qty: 0,
        unitPrice: 0,
        result: 0,
      },
      gathering: {
        selected: false,
        qty: 0,
        unitPrice: 0,
        result: 0,
      },
      binding: {
        selected: false,
        type: null,
        template: null,
        qty: 0,
        unitPrice: 0,
        result: 0,
      },
    },
    calendar: {
      skip: false,
    },
    materialSupply: {
      supplier: "customer",
      items: {
        ctpPlate: { supplier: "customer", supplierName: "" },
        dieCutterMaker: { supplier: "customer", supplierName: "" },
        dieCutting: { supplier: "customer", supplierName: "" },
        laminating: { supplier: "customer", supplierName: "" },
        cutting: { supplier: "customer", supplierName: "" },
        binding: { supplier: "customer", supplierName: "" },
        packaging: { supplier: "customer", supplierName: "" },
      },
    },
  };

  const handleFormChange = (data: any) => {
    console.log("Form data changed:", data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">New Offset Print Job</h1>
      <OffsetPrintForm
        formData={initialFormData}
        onChange={handleFormChange}
        suppliers={[]}
      />
    </div>
  );
} 
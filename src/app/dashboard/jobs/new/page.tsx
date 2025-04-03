"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PermissionGate from "@/components/PermissionGate";
import { useCurrency } from "@/contexts/CurrencyContext";
import { OffsetPrintForm, OffsetPrintFormData } from "@/components/forms/OffsetPrintForm";
import { JobTypeSelector } from "@/components/forms/JobTypeSelector";

// Default pricing settings (in a real app, this would be fetched from API)
const defaultPricing = {
  digitalPrint: {
    sqftPrice: 5.00,
    offcutSqftPrice: 4.00,
    ringsPrice: 0.30,
    polePrice: 0.20,
  },
  offsetPrint: {
    setupCost: 100.00,
    platePrice: 25.00,
    paperCost: 0.05,  // per sheet
    inkCost: 0.10,    // per impression
    laborRate: 60.00, // per hour
    profitMargin: 30  // percentage
  },
  sublimation: {
    baseCost: 7.50,
    setupFee: 15.00,
    materialCost: 3.00
  }
};

// Available roll widths
const availableRolls = ["24\"", "36\"", "42\"", "48\"", "54\"", "60\""];

const initialFormData: OffsetPrintFormData = {
  customerId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  deliveryDate: "",
  jobNumber: "",
  jobName: "",
  quantity: 1,
  jobType: "",
  notes: "",
  paperSupplyByCustomer: false,
  paperCuttingByCustomer: false,
  paperType: "",
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
    customColorValue: ""
  },
  paperItems: [],
  paperSize: "",
  paperWeight: "",
  paperFinish: "",
  paperGrain: "",
  customWidth: "",
  customHeight: "",
  specialRequirements: {
    perforation: false,
    scoring: false,
    embossing: false,
    foiling: false
  },
  printingSystem: "",
  printImpression: {
    qty: 0,
    unitPrice: 0,
    result: 0
  },
  laminating: {
    type: "none",
    height: 0,
    width: 0,
    unitPrice: 0,
    qty: 0,
    result: 0
  },
  dieCut: {
    cutter: {
      newCutter: false,
      oldCutter: false,
      creasing: false,
      perforating: false,
      embossing: false,
      debossing: false
    },
    impression: {
      qty: 0,
      unitPrice: 0,
      result: 0
    }
  },
  billBooks: {
    numberOfPapers: 1,
    papers: [],
    details: {
      billNumbers: "",
      bookNumbers: "",
      sets: 0,
      qty: 0,
      unitPrice: 0,
      price: 0
    },
    gathering: {
      selected: false,
      qty: 0,
      unitPrice: 0,
      result: 0
    },
    binding: {
      selected: false,
      type: "",
      template: "",
      qty: 0,
      unitPrice: 0,
      result: 0
    }
  },
  calendar: {
    skip: false
  },
  materialSupply: {
    supplier: "customer",
    supplierName: "",
    items: {
      ctpPlate: false,
      dieCutterMaker: false,
      dieCutting: false,
      laminating: false,
      cutting: false,
      binding: false,
      packaging: false
    }
  }
};

export default function NewJobPage() {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [priceVisible, setPriceVisible] = useState(true);
  const [jobPricing, setJobPricing] = useState(defaultPricing);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  
  // Job details state
  const [jobDetails, setJobDetails] = useState({
    customer: "",
    jobType: "",
    description: "",
    width: 0,
    height: 0,
    quantity: 1,
    rollWidth: "36\"",
    useRings: false,
    ringCount: 0,
    usePole: false,
    priority: "Normal",
    dueDate: "",
    notes: "",
    finishingOption: "None",
    paperType: "Standard",
    paperSize: "Letter",
    colorType: "CMYK",
    doubleSided: false,
    plateCount: 4,
    setupTime: 1,
    material: "Polyester",
    pressTime: 60,
    temperature: 400
  });

  // Offset print form data state
  const [offsetFormData, setOffsetFormData] = useState<OffsetPrintFormData>(initialFormData);

  useEffect(() => {
    // Simulate API fetch for pricing configuration
    const fetchPricing = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    
    fetchPricing();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setJobDetails(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    // Handle number inputs
    if (type === 'number') {
      setJobDetails(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
      return;
    }
    
    // Handle other inputs
    setJobDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate the print area in square feet
  const calculatePrintArea = () => {
    if (!jobDetails.width || !jobDetails.height) return 0;
    const widthInFeet = jobDetails.width / 12;
    const heightInFeet = jobDetails.height / 12;
    return widthInFeet * heightInFeet * jobDetails.quantity;
  };

  // Calculate the offcut area
  const calculateOffcutArea = () => {
    if (!jobDetails.width || !jobDetails.height || !jobDetails.rollWidth) return { width: 0, height: 0, area: 0 };
    
    // Parse roll width (remove the inch symbol and convert to number)
    const rollWidthInches = parseInt(jobDetails.rollWidth.replace('"', ''));
    
    // Calculate offcut dimensions
    const offcutWidth = jobDetails.width;
    const offcutHeight = rollWidthInches - jobDetails.height;
    
    // Ensure we don't have negative offcut
    if (offcutHeight <= 0) return { width: 0, height: 0, area: 0 };
    
    // Calculate area in square feet
    const offcutWidthFeet = offcutWidth / 12;
    const offcutHeightFeet = offcutHeight / 12;
    const area = offcutWidthFeet * offcutHeightFeet;
    
    return { 
      width: offcutWidth, 
      height: offcutHeight,
      area: area
    };
  };

  // Calculate total job price
  const calculateTotalPrice = () => {
    if (!jobDetails.width || !jobDetails.height) return 0;
    
    let total = 0;
    
    switch(jobDetails.jobType) {
      case "Digital Print":
        // Calculate print area cost
        const printArea = calculatePrintArea();
        total += printArea * jobPricing.digitalPrint.sqftPrice;
        
        // Calculate offcut cost if applicable
        const offcutData = calculateOffcutArea();
        if (offcutData.area > 0) {
          total += offcutData.area * jobPricing.digitalPrint.offcutSqftPrice;
        }
        
        // Add rings cost if applicable
        if (jobDetails.useRings && jobDetails.ringCount > 0) {
          total += jobDetails.ringCount * jobPricing.digitalPrint.ringsPrice;
        }
        
        // Add pole cost if applicable
        if (jobDetails.usePole) {
          total += jobPricing.digitalPrint.polePrice;
        }
        break;
        
      case "Offset Print":
        // Based on Solution360 model
        // Setup cost + (plates * plate price) + (quantity * paper cost) + (impressions * ink cost) + (setup time * labor rate)
        const platesCost = jobDetails.plateCount * jobPricing.offsetPrint.platePrice;
        const paperCost = jobDetails.quantity * jobPricing.offsetPrint.paperCost;
        const impressions = jobDetails.quantity * (jobDetails.doubleSided ? 2 : 1);
        const inkCost = impressions * jobPricing.offsetPrint.inkCost;
        const laborCost = jobDetails.setupTime * jobPricing.offsetPrint.laborRate;
        
        // Base cost without profit
        const baseCost = jobPricing.offsetPrint.setupCost + platesCost + paperCost + inkCost + laborCost;
        
        // Add profit margin
        total = baseCost * (1 + (jobPricing.offsetPrint.profitMargin / 100));
        break;
        
      case "Sublimation":
        // Base + (area * material cost) + setup fee
        const area = calculatePrintArea();
        total = jobPricing.sublimation.baseCost + (area * jobPricing.sublimation.materialCost) + jobPricing.sublimation.setupFee;
        break;
        
      default:
        // For other job types, use a simple area-based calculation
        const baseArea = calculatePrintArea();
        total = baseArea * 10; // A simple default rate of $10 per sq.ft
    }
    
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle job submission logic here
    alert("Job created successfully!");
  };

  const handleJobTypeSelect = (jobType: string) => {
    setSelectedJobType(jobType);
    setJobDetails(prev => ({ ...prev, jobType }));
    setOffsetFormData(prev => ({ ...prev, jobType }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!selectedJobType ? (
        <JobTypeSelector onSelect={handleJobTypeSelect} />
      ) : selectedJobType === "Offset Print" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">New Offset Print Job</h1>
            <button
              onClick={() => setSelectedJobType(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Change Job Type
            </button>
          </div>
          <OffsetPrintForm
            formData={offsetFormData}
            onChange={setOffsetFormData}
            paperTypes={["Standard", "Premium", "Glossy", "Matte"]}
            suppliers={["Supplier A", "Supplier B", "Supplier C"]}
          />
        </div>
      ) : (
        <div className="bg-card rounded-lg border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">New {selectedJobType} Job</h1>
            <button
              onClick={() => setSelectedJobType(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Change Job Type
            </button>
          </div>
          <p className="text-muted-foreground">Form for {selectedJobType} coming soon...</p>
        </div>
      )}
    </div>
  );
} 
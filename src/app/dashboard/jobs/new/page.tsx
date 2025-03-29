"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PermissionGate from "@/components/PermissionGate";
import { useCurrency } from "@/contexts/CurrencyContext";

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

export default function NewJobPage() {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [priceVisible, setPriceVisible] = useState(true);
  const [jobPricing, setJobPricing] = useState(defaultPricing);
  
  // Job details state
  const [jobDetails, setJobDetails] = useState({
    customer: "",
    jobType: "Digital Print",
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

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Job</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-150 flex items-center gap-2"
        >
          <span>Cancel</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                Customer*
              </label>
              <select
                id="customer"
                name="customer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jobDetails.customer}
                onChange={handleChange}
                required
              >
                <option value="">Select a customer</option>
                <option value="1">ABC Corporation</option>
                <option value="2">XYZ Industries</option>
                <option value="3">Local Business LLC</option>
                <option value="4">Smith & Sons</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type*
              </label>
              <select
                id="jobType"
                name="jobType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jobDetails.jobType}
                onChange={handleChange}
                required
              >
                <option value="Digital Print">Digital Print</option>
                <option value="Offset Print">Offset Print</option>
                <option value="Large Format">Large Format</option>
                <option value="Binding">Binding</option>
                <option value="Finishing">Finishing</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description*
              </label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Brief description of the job"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jobDetails.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                Width (inches)*
              </label>
              <input
                type="number"
                id="width"
                name="width"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jobDetails.width || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (inches)*
              </label>
              <input
                type="number"
                id="height"
                name="height"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jobDetails.height || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity*
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jobDetails.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Digital Print specific fields */}
          {jobDetails.jobType === "Digital Print" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="rollWidth" className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Width
                  </label>
                  <select
                    id="rollWidth"
                    name="rollWidth"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobDetails.rollWidth}
                    onChange={handleChange}
                  >
                    {availableRolls.map(width => (
                      <option key={width} value={width}>{width}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center h-[42px]">
                    <input
                      type="checkbox"
                      id="useRings"
                      name="useRings"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={jobDetails.useRings}
                      onChange={handleChange}
                    />
                    <label htmlFor="useRings" className="ml-2 block text-sm font-medium text-gray-700">
                      Add Rings
                    </label>
                  </div>
                  
                  {jobDetails.useRings && (
                    <div className="ml-4">
                      <input
                        type="number"
                        id="ringCount"
                        name="ringCount"
                        min="0"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={jobDetails.ringCount || ''}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center h-[42px]">
                  <input
                    type="checkbox"
                    id="usePole"
                    name="usePole"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={jobDetails.usePole}
                    onChange={handleChange}
                  />
                  <label htmlFor="usePole" className="ml-2 block text-sm font-medium text-gray-700">
                    Add Pole for Mounting
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="finishingOption" className="block text-sm font-medium text-gray-700 mb-1">
                  Finishing Options
                </label>
                <select
                  id="finishingOption"
                  name="finishingOption"
                  className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={jobDetails.finishingOption}
                  onChange={handleChange}
                >
                  <option value="None">None</option>
                  <option value="Laminating">Laminating</option>
                  <option value="Space Only">Space Only</option>
                  <option value="Pocket Only">Pocket Only</option>
                  <option value="Print and Cut">Print and Cut</option>
                </select>
              </div>
            </>
          )}
          
          {/* Offset Print specific fields */}
          {jobDetails.jobType === "Offset Print" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="paperType" className="block text-sm font-medium text-gray-700 mb-1">
                    Paper Type
                  </label>
                  <select
                    id="paperType"
                    name="paperType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobDetails.paperType}
                    onChange={handleChange}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Glossy">Glossy</option>
                    <option value="Matte">Matte</option>
                    <option value="Cardstock">Cardstock</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="paperSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Paper Size
                  </label>
                  <select
                    id="paperSize"
                    name="paperSize"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobDetails.paperSize}
                    onChange={handleChange}
                  >
                    <option value="Letter">Letter (8.5" x 11")</option>
                    <option value="Legal">Legal (8.5" x 14")</option>
                    <option value="Tabloid">Tabloid (11" x 17")</option>
                    <option value="A4">A4 (210mm x 297mm)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="colorType" className="block text-sm font-medium text-gray-700 mb-1">
                    Color Type
                  </label>
                  <select
                    id="colorType"
                    name="colorType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobDetails.colorType}
                    onChange={handleChange}
                  >
                    <option value="CMYK">Full Color (CMYK)</option>
                    <option value="Spot">Spot Color</option>
                    <option value="BW">Black & White</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center h-[42px]">
                  <input
                    type="checkbox"
                    id="doubleSided"
                    name="doubleSided"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={jobDetails.doubleSided}
                    onChange={handleChange}
                  />
                  <label htmlFor="doubleSided" className="ml-2 block text-sm font-medium text-gray-700">
                    Double-sided Printing
                  </label>
                </div>
                <div>
                  <label htmlFor="plateCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Plates
                  </label>
                  <input
                    type="number"
                    id="plateCount"
                    name="plateCount"
                    min="1"
                    max="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobDetails.plateCount}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="setupTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Setup Time (hours)
                  </label>
                  <input
                    type="number"
                    id="setupTime"
                    name="setupTime"
                    min="0.5"
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobDetails.setupTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Sublimation specific fields */}
          {jobDetails.jobType === "Sublimation" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <select
                  id="material"
                  name="material"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={jobDetails.material}
                  onChange={handleChange}
                >
                  <option value="Polyester">Polyester</option>
                  <option value="Ceramic">Ceramic</option>
                  <option value="Metal">Metal</option>
                  <option value="Glass">Glass</option>
                </select>
              </div>
              <div>
                <label htmlFor="pressTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Press Time (seconds)
                </label>
                <input
                  type="number"
                  id="pressTime"
                  name="pressTime"
                  min="30"
                  max="180"
                  step="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={jobDetails.pressTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  id="temperature"
                  name="temperature"
                  min="350"
                  max="450"
                  step="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={jobDetails.temperature}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jobDetails.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jobDetails.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <PermissionGate permission="jobs.viewPricing">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Pricing Calculation</h2>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setPriceVisible(!priceVisible)}
              >
                {priceVisible ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {priceVisible && (
              <div className="space-y-4">
                {jobDetails.jobType === "Digital Print" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Print Area:</span>
                        <span className="font-medium">{calculatePrintArea().toFixed(2)} sq.ft</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Print Cost:</span>
                        <span className="font-medium">{formatCurrency(calculatePrintArea() * jobPricing.digitalPrint.sqftPrice)}</span>
                      </div>
                      
                      {calculateOffcutArea().area > 0 && (
                        <>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Offcut Area:</span>
                            <span className="font-medium">{calculateOffcutArea().area.toFixed(2)} sq.ft</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Offcut Cost:</span>
                            <span className="font-medium">{formatCurrency(calculateOffcutArea().area * jobPricing.digitalPrint.offcutSqftPrice)}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {jobDetails.useRings && jobDetails.ringCount > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Rings ({jobDetails.ringCount}):</span>
                          <span className="font-medium">{formatCurrency(jobDetails.ringCount * jobPricing.digitalPrint.ringsPrice)}</span>
                        </div>
                      )}
                      
                      {jobDetails.usePole && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Pole Mounting:</span>
                          <span className="font-medium">{formatCurrency(jobPricing.digitalPrint.polePrice)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {jobDetails.jobType === "Offset Print" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Setup Cost:</span>
                        <span className="font-medium">{formatCurrency(jobPricing.offsetPrint.setupCost)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Plates ({jobDetails.plateCount}):</span>
                        <span className="font-medium">{formatCurrency(jobDetails.plateCount * jobPricing.offsetPrint.platePrice)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Paper ({jobDetails.quantity} sheets):</span>
                        <span className="font-medium">{formatCurrency(jobDetails.quantity * jobPricing.offsetPrint.paperCost)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Impressions ({jobDetails.quantity * (jobDetails.doubleSided ? 2 : 1)}):</span>
                        <span className="font-medium">{formatCurrency(jobDetails.quantity * (jobDetails.doubleSided ? 2 : 1) * jobPricing.offsetPrint.inkCost)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Labor ({jobDetails.setupTime} hours):</span>
                        <span className="font-medium">{formatCurrency(jobDetails.setupTime * jobPricing.offsetPrint.laborRate)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Profit Margin ({jobPricing.offsetPrint.profitMargin}%):</span>
                        <span className="font-medium">{formatCurrency(
                          (jobPricing.offsetPrint.setupCost + 
                          (jobDetails.plateCount * jobPricing.offsetPrint.platePrice) + 
                          (jobDetails.quantity * jobPricing.offsetPrint.paperCost) + 
                          (jobDetails.quantity * (jobDetails.doubleSided ? 2 : 1) * jobPricing.offsetPrint.inkCost) + 
                          (jobDetails.setupTime * jobPricing.offsetPrint.laborRate)) * 
                          (jobPricing.offsetPrint.profitMargin / 100)
                        )}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {jobDetails.jobType === "Sublimation" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Base Cost:</span>
                        <span className="font-medium">{formatCurrency(jobPricing.sublimation.baseCost)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Setup Fee:</span>
                        <span className="font-medium">{formatCurrency(jobPricing.sublimation.setupFee)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Material Cost:</span>
                        <span className="font-medium">{formatCurrency(calculatePrintArea() * jobPricing.sublimation.materialCost)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total Price:</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(calculateTotalPrice())}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  <p>Calculation formula:</p>
                  {jobDetails.jobType === "Digital Print" && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Print area = width × height × quantity (in sq.ft)</li>
                      <li>Offcut area = width × (roll width - height) (in sq.ft)</li>
                      <li>Total = (print area × price) + (offcut area × offcut price) + (rings × ring price) + pole price</li>
                    </ul>
                  )}
                  {jobDetails.jobType === "Offset Print" && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Setup cost + (plates × plate price) + (quantity × paper cost)</li>
                      <li>+ (impressions × ink cost) + (setup time × labor rate)</li>
                      <li>× (1 + profit margin)</li>
                      <li>Note: Impressions = quantity × (2 if double-sided, 1 if single-sided)</li>
                    </ul>
                  )}
                  {jobDetails.jobType === "Sublimation" && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Base cost + (print area × material cost) + setup fee</li>
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </PermissionGate>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Additional Notes</h2>
          <div>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional instructions or information about the job"
              value={jobDetails.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Job
          </button>
        </div>
      </form>
      
      {/* For development purposes only - to easily toggle pricing visibility */}
      <PermissionGate permission="settings.pricing">
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-md font-medium mb-2">Development Options</h3>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="toggle-price"
              checked={priceVisible}
              onChange={() => setPriceVisible(!priceVisible)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="toggle-price" className="text-sm text-gray-700">
              Toggle Price Visibility (normally controlled by permissions)
            </label>
          </div>
        </div>
      </PermissionGate>
    </div>
  );
} 
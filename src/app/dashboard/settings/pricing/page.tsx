"use client";

import { useState } from "react";
import Link from "next/link";
import PermissionGate from "@/components/PermissionGate";

// Default pricing settings
const defaultPricing = {
  digitalPrint: {
    sqftPrice: 5.00,
    offcutSqftPrice: 4.00,
    ringsPrice: 0.30,
    polePrice: 0.20,
  },
  offset: {
    basePrice: 0.75,
    setupFee: 50.00,
    rushFee: 25.00,
  },
  sublimation: {
    sqftPrice: 8.00,
    setupFee: 35.00,
  }
};

// Currency configuration
const currencies = {
  USD: {
    symbol: "$",
    code: "USD",
    name: "US Dollar",
    exchangeRate: 1,
  },
  LKR: {
    symbol: "Rs.",
    code: "LKR",
    name: "Sri Lankan Rupee",
    exchangeRate: 325.68, // Example exchange rate (1 USD = 325.68 LKR)
  }
};

export default function PricingPage() {
  const [pricing, setPricing] = useState(defaultPricing);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPricing, setEditingPricing] = useState(defaultPricing);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("digitalPrint");
  const [currency, setCurrency] = useState<keyof typeof currencies>("USD");

  const handleEditClick = () => {
    setIsEditing(true);
    setEditingPricing({...pricing});
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingPricing({...pricing});
  };

  const handleSaveClick = () => {
    setPricing({...editingPricing});
    setIsEditing(false);
    setIsSaved(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleChange = (category: string, field: string, value: string) => {
    const numValue = parseFloat(value);
    const newValue = isNaN(numValue) ? 0 : numValue;
    
    setEditingPricing(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: newValue
      }
    }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as keyof typeof currencies);
  };

  const formatCurrency = (value: number) => {
    const currencyData = currencies[currency];
    const convertedValue = value * currencyData.exchangeRate;
    
    return `${currencyData.symbol}${convertedValue.toFixed(2)}`;
  };

  return (
    <PermissionGate permission="settings.pricing">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pricing Configuration</h1>
          <div className="flex gap-2">
            <Link 
              href="/dashboard/settings"
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Settings
            </Link>
          </div>
        </div>

        {isSaved && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md animate-fadeIn">
            Pricing configuration has been saved successfully.
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("digitalPrint")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "digitalPrint" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Digital Print
                </button>
                <button
                  onClick={() => setActiveTab("offset")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "offset" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Offset Print
                </button>
                <button
                  onClick={() => setActiveTab("sublimation")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "sublimation" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Sublimation
                </button>
              </div>
              <div className="flex items-center">
                <label htmlFor="currency" className="mr-2 text-sm font-medium text-gray-700">
                  Display Currency:
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(currencies).map(([code, currencyData]) => (
                    <option key={code} value={code}>
                      {currencyData.name} ({currencyData.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">
                {activeTab === "digitalPrint" && "Digital Print Pricing"}
                {activeTab === "offset" && "Offset Print Pricing"}
                {activeTab === "sublimation" && "Sublimation Pricing"}
              </h2>
              {!isEditing ? (
                <button 
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit Pricing
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleCancelClick}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Currency Note */}
            <div className="mb-6 text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-yellow-800">
                <strong>Note:</strong> Prices are stored in USD. Displayed in {currencies[currency].name} at a rate of 
                1 USD = {currencies[currency].exchangeRate} {currency}.
              </p>
            </div>

            {/* Digital Print Pricing */}
            {activeTab === "digitalPrint" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h3 className="text-sm font-medium uppercase text-gray-700">Print SQ Feet Price</h3>
                      </div>
                      <div className="p-4">
                        {isEditing ? (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={editingPricing.digitalPrint.sqftPrice}
                              onChange={(e) => handleChange("digitalPrint", "sqftPrice", e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-800">
                            {formatCurrency(pricing.digitalPrint.sqftPrice)}
                          </div>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Price per square foot for digital prints
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h3 className="text-sm font-medium uppercase text-gray-700">Off-Cut SQ Feet Price</h3>
                      </div>
                      <div className="p-4">
                        {isEditing ? (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={editingPricing.digitalPrint.offcutSqftPrice}
                              onChange={(e) => handleChange("digitalPrint", "offcutSqftPrice", e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-800">
                            {formatCurrency(pricing.digitalPrint.offcutSqftPrice)}
                          </div>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Price per square foot for off-cuts
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h3 className="text-sm font-medium uppercase text-gray-700">Rings Price</h3>
                      </div>
                      <div className="p-4">
                        {isEditing ? (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={editingPricing.digitalPrint.ringsPrice}
                              onChange={(e) => handleChange("digitalPrint", "ringsPrice", e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-800">
                            {formatCurrency(pricing.digitalPrint.ringsPrice)}
                          </div>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Price per ring for mounting
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h3 className="text-sm font-medium uppercase text-gray-700">Pole Price</h3>
                      </div>
                      <div className="p-4">
                        {isEditing ? (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={editingPricing.digitalPrint.polePrice}
                              onChange={(e) => handleChange("digitalPrint", "polePrice", e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-800">
                            {formatCurrency(pricing.digitalPrint.polePrice)}
                          </div>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Price per pole for mounting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Pricing Example</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700">For a 24" × 36" print (6 sq ft):</p>
                      <ul className="mt-2 text-sm text-blue-600 space-y-1">
                        <li>Base print cost: 6 sq ft × {formatCurrency(pricing.digitalPrint.sqftPrice)} = {formatCurrency(6 * pricing.digitalPrint.sqftPrice)}</li>
                        <li>With 4 rings: 4 × {formatCurrency(pricing.digitalPrint.ringsPrice)} = {formatCurrency(4 * pricing.digitalPrint.ringsPrice)}</li>
                        <li>With pole mounting: {formatCurrency(pricing.digitalPrint.polePrice)}</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">For a 20" × 20" print with off-cuts:</p>
                      <ul className="mt-2 text-sm text-blue-600 space-y-1">
                        <li>Print area: 2.78 sq ft × {formatCurrency(pricing.digitalPrint.sqftPrice)} = {formatCurrency(2.78 * pricing.digitalPrint.sqftPrice)}</li>
                        <li>Off-cut area: 0.56 sq ft × {formatCurrency(pricing.digitalPrint.offcutSqftPrice)} = {formatCurrency(0.56 * pricing.digitalPrint.offcutSqftPrice)}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Offset Print Pricing */}
            {activeTab === "offset" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-sm font-medium uppercase text-gray-700">Base Price Per Unit</h3>
                    </div>
                    <div className="p-4">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingPricing.offset.basePrice}
                            onChange={(e) => handleChange("offset", "basePrice", e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrency(pricing.offset.basePrice)}
                        </div>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Base price per printed unit
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-sm font-medium uppercase text-gray-700">Setup Fee</h3>
                    </div>
                    <div className="p-4">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingPricing.offset.setupFee}
                            onChange={(e) => handleChange("offset", "setupFee", e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrency(pricing.offset.setupFee)}
                        </div>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        One-time setup fee per job
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-sm font-medium uppercase text-gray-700">Rush Fee</h3>
                    </div>
                    <div className="p-4">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingPricing.offset.rushFee}
                            onChange={(e) => handleChange("offset", "rushFee", e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrency(pricing.offset.rushFee)}
                        </div>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Additional fee for rush orders
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sublimation Pricing */}
            {activeTab === "sublimation" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-sm font-medium uppercase text-gray-700">Square Foot Price</h3>
                    </div>
                    <div className="p-4">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingPricing.sublimation.sqftPrice}
                            onChange={(e) => handleChange("sublimation", "sqftPrice", e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrency(pricing.sublimation.sqftPrice)}
                        </div>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Price per square foot for sublimation prints
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-sm font-medium uppercase text-gray-700">Setup Fee</h3>
                    </div>
                    <div className="p-4">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingPricing.sublimation.setupFee}
                            onChange={(e) => handleChange("sublimation", "setupFee", e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrency(pricing.sublimation.setupFee)}
                        </div>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        One-time setup fee per job
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PermissionGate>
  );
} 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Save, X } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

// Mock data
const defaultJobTypes = [
  { id: 1, name: "Digital Print", isActive: true },
  { id: 2, name: "Offset Print", isActive: true },
  { id: 3, name: "Large Format", isActive: true },
  { id: 4, name: "Binding", isActive: true },
  { id: 5, name: "Finishing", isActive: false },
];

const defaultMaterials = [
  { id: 1, name: "80gsm Bond Paper", category: "Paper", isActive: true, costPrice: 0.05 },
  { id: 2, name: "100gsm Glossy Paper", category: "Paper", isActive: true, costPrice: 0.08 },
  { id: 3, name: "250gsm Card Stock", category: "Paper", isActive: true, costPrice: 0.15 },
  { id: 4, name: "3mm PVC Board", category: "Board", isActive: true, costPrice: 2.50 },
  { id: 5, name: "5mm Foam Board", category: "Board", isActive: true, costPrice: 3.75 },
  { id: 6, name: "Vinyl Sticker", category: "Vinyl", isActive: true, costPrice: 1.25 },
  { id: 7, name: "Canvas", category: "Fabric", isActive: false, costPrice: 4.50 },
];

const defaultPricing = [
  { id: 1, jobType: "Digital Print", itemName: "A4 Color Print", basePrice: 1.00, isActive: true },
  { id: 2, jobType: "Digital Print", itemName: "A4 B&W Print", basePrice: 0.50, isActive: true },
  { id: 3, jobType: "Offset Print", itemName: "1000 Business Cards", basePrice: 120.00, isActive: true },
  { id: 4, jobType: "Large Format", itemName: "Banner per sqm", basePrice: 45.00, isActive: true },
  { id: 5, jobType: "Binding", itemName: "Spiral Binding", basePrice: 5.00, isActive: true },
  { id: 6, jobType: "Finishing", itemName: "Lamination A4", basePrice: 2.50, isActive: false },
];

// New mock data for price configurations
const defaultPriceConfigs = [
  { id: 1, category: "Digital Print", name: "Color Print (per sq.ft)", price: 3.50, isActive: true },
  { id: 2, category: "Digital Print", name: "B&W Print (per sq.ft)", price: 2.00, isActive: true },
  { id: 3, category: "Large Format", name: "Banner Print (per sq.ft)", price: 5.25, isActive: true },
  { id: 4, category: "Offcut", name: "Offcut Fee (standard)", price: 10.00, isActive: true },
  { id: 5, category: "Offcut", name: "Offcut Fee (minimized)", price: 5.00, isActive: true },
  { id: 6, category: "Setup", name: "Basic Setup Fee", price: 15.00, isActive: true },
  { id: 7, category: "Setup", name: "Advanced Setup Fee", price: 30.00, isActive: true },
  { id: 8, category: "Rush", name: "Rush Fee (24hr)", price: 25.00, isActive: true },
  { id: 9, category: "Rush", name: "Rush Fee (same day)", price: 50.00, isActive: true },
];

// Categories for price configurations
const priceConfigCategories = [
  "Digital Print",
  "Large Format",
  "Offcut",
  "Setup",
  "Rush",
  "Other"
];

export default function SettingsPage() {
  const { currency, setCurrency, exchangeRates, setExchangeRates } = useCurrency();
  const [activeTab, setActiveTab] = useState("job-types");
  const [jobTypes, setJobTypes] = useState(defaultJobTypes);
  const [materials, setMaterials] = useState(defaultMaterials);
  const [pricing, setPricing] = useState(defaultPricing);
  const [priceConfigs, setPriceConfigs] = useState(defaultPriceConfigs);
  const [editingJobType, setEditingJobType] = useState<{ id: number, name: string } | null>(null);
  const [newJobType, setNewJobType] = useState("");
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    category: "",
    costPrice: 0
  });
  const [editingPricing, setEditingPricing] = useState<any | null>(null);
  const [newPricing, setNewPricing] = useState({
    jobType: "",
    itemName: "",
    basePrice: 0
  });
  const [editingPriceConfig, setEditingPriceConfig] = useState<any | null>(null);
  const [newPriceConfig, setNewPriceConfig] = useState({
    category: "",
    name: "",
    price: 0
  });
  const [editingExchangeRate, setEditingExchangeRate] = useState<string | null>(null);
  const [newExchangeRate, setNewExchangeRate] = useState<number>(0);
  
  // Database configuration state
  const [dbConfig, setDbConfig] = useState({
    type: "mysql",
    host: "mysql.namecheap.com",
    port: 3306,
    username: "db_user",
    password: "password123",
    database: "zynkprint_db",
    ssl: true
  });
  const [isEditingDbConfig, setIsEditingDbConfig] = useState(false);

  // Helper function to get currency name
  const getCurrencyName = (code: string): string => {
    const currencyNames: Record<string, string> = {
      USD: "US Dollar",
      EUR: "Euro",
      GBP: "British Pound",
      CAD: "Canadian Dollar",
      AUD: "Australian Dollar",
      JPY: "Japanese Yen",
      INR: "Indian Rupee",
      LKR: "Sri Lankan Rupee"
    };
    return currencyNames[code] || code;
  };

  // Job Types handlers
  const handleSaveJobType = () => {
    if (editingJobType) {
      setJobTypes(jobTypes.map(jt => 
        jt.id === editingJobType.id ? { ...jt, name: editingJobType.name } : jt
      ));
      setEditingJobType(null);
    }
  };

  const handleToggleJobTypeStatus = (id: number) => {
    setJobTypes(jobTypes.map(jt => 
      jt.id === id ? { ...jt, isActive: !jt.isActive } : jt
    ));
  };

  const handleAddJobType = () => {
    if (newJobType.trim()) {
      const newId = Math.max(0, ...jobTypes.map(jt => jt.id)) + 1;
      setJobTypes([...jobTypes, { id: newId, name: newJobType, isActive: true }]);
      setNewJobType("");
    }
  };

  // Materials handlers
  const handleSaveMaterial = () => {
    if (editingMaterial) {
      setMaterials(materials.map(m => 
        m.id === editingMaterial.id ? { ...m, ...editingMaterial } : m
      ));
      setEditingMaterial(null);
    }
  };

  const handleToggleMaterialStatus = (id: number) => {
    setMaterials(materials.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const handleAddMaterial = () => {
    if (newMaterial.name.trim() && newMaterial.category.trim()) {
      const newId = Math.max(0, ...materials.map(m => m.id)) + 1;
      setMaterials([...materials, { 
        id: newId, 
        name: newMaterial.name, 
        category: newMaterial.category,
        costPrice: newMaterial.costPrice,
        isActive: true 
      }]);
      setNewMaterial({
        name: "",
        category: "",
        costPrice: 0
      });
    }
  };

  // Pricing handlers
  const handleSavePricing = () => {
    if (editingPricing) {
      setPricing(pricing.map(p => 
        p.id === editingPricing.id ? { ...p, ...editingPricing } : p
      ));
      setEditingPricing(null);
    }
  };

  const handleTogglePricingStatus = (id: number) => {
    setPricing(pricing.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleAddPricing = () => {
    if (newPricing.jobType.trim() && newPricing.itemName.trim()) {
      const newId = Math.max(0, ...pricing.map(p => p.id)) + 1;
      setPricing([...pricing, { 
        id: newId, 
        jobType: newPricing.jobType, 
        itemName: newPricing.itemName,
        basePrice: newPricing.basePrice,
        isActive: true 
      }]);
      setNewPricing({
        jobType: "",
        itemName: "",
        basePrice: 0
      });
    }
  };

  // Price Configuration handlers
  const handleSavePriceConfig = () => {
    if (editingPriceConfig) {
      setPriceConfigs(priceConfigs.map(pc => 
        pc.id === editingPriceConfig.id ? { ...pc, ...editingPriceConfig } : pc
      ));
      setEditingPriceConfig(null);
    }
  };

  const handleTogglePriceConfigStatus = (id: number) => {
    setPriceConfigs(priceConfigs.map(pc => 
      pc.id === id ? { ...pc, isActive: !pc.isActive } : pc
    ));
  };

  const handleAddPriceConfig = () => {
    if (newPriceConfig.category.trim() && newPriceConfig.name.trim()) {
      const newId = Math.max(0, ...priceConfigs.map(pc => pc.id)) + 1;
      setPriceConfigs([...priceConfigs, { 
        id: newId, 
        category: newPriceConfig.category, 
        name: newPriceConfig.name,
        price: newPriceConfig.price,
        isActive: true 
      }]);
      setNewPriceConfig({
        category: "",
        name: "",
        price: 0
      });
    }
  };

  const handleSaveExchangeRate = () => {
    if (editingExchangeRate) {
      const updatedRates = {
        ...exchangeRates,
        [editingExchangeRate]: newExchangeRate
      };
      setExchangeRates(updatedRates);
      setEditingExchangeRate(null);
    }
  };
  
  const handleEditExchangeRate = (currencyCode: string) => {
    setNewExchangeRate(exchangeRates[currencyCode as keyof typeof exchangeRates]);
    setEditingExchangeRate(currencyCode);
  };
  
  const handleSaveDbConfig = () => {
    // In a real application, this would save to API/localStorage
    console.log("Saving database configuration:", dbConfig);
    setIsEditingDbConfig(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">Manage users, roles, and permissions in the system.</p>
            <div className="space-y-2">
              <Link 
                href="/dashboard/settings/users"
                className="block text-blue-600 hover:text-blue-800"
              >
                Users
              </Link>
              <Link 
                href="/dashboard/settings/roles"
                className="block text-blue-600 hover:text-blue-800"
              >
                Roles & Permissions
              </Link>
            </div>
          </div>
        </div>

        {/* Pricing Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Pricing Configuration</h2>
            <p className="text-gray-600 mb-4">Configure pricing for different print services.</p>
            <div className="space-y-2">
              <Link 
                href="/dashboard/settings/pricing"
                className="block text-blue-600 hover:text-blue-800"
              >
                Manage Pricing
              </Link>
            </div>
          </div>
        </div>
        
        {/* Currency Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Currency Settings</h2>
            <p className="text-gray-600 mb-4">Configure system currency and exchange rates.</p>
            
            <div className="mb-4">
              <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                Default Currency
              </label>
              <select
                id="defaultCurrency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
                <option value="AUD">Australian Dollar (A$)</option>
                <option value="JPY">Japanese Yen (¥)</option>
                <option value="INR">Indian Rupee (₹)</option>
                <option value="LKR">Sri Lankan Rupee (Rs.)</option>
              </select>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium mb-3">Exchange Rates</h3>
              
              <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
                <span>USD (Base Currency)</span>
                <span>1.00</span>
              </div>
              
              {Object.entries(exchangeRates)
                .filter(([currency]) => currency !== 'USD')
                .map(([currency, rate]) => (
                  <div key={currency} className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{currency} - {getCurrencyName(currency)}</span>
                    {editingExchangeRate !== currency ? (
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{rate.toFixed(2)}</span>
                        <button
                          onClick={() => handleEditExchangeRate(currency)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={newExchangeRate}
                          onChange={(e) => setNewExchangeRate(parseFloat(e.target.value))}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Exchange rate"
                          step="0.01"
                          min="0"
                        />
                        <button
                          onClick={handleSaveExchangeRate}
                          className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                ))
              }
              
              <p className="mt-3 text-xs text-gray-500">
                * Exchange rates are used for displaying prices in different currencies. All prices are stored in {currency}.
              </p>
            </div>
          </div>
        </div>
        
        {/* Database Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Database Configuration</h2>
              <button
                onClick={() => setIsEditingDbConfig(!isEditingDbConfig)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isEditingDbConfig ? "Cancel" : "Edit"}
              </button>
            </div>
            <p className="text-gray-600 mb-4">Configure database connection for Namecheap MySQL hosting.</p>
            
            {!isEditingDbConfig ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{dbConfig.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Host:</span>
                  <span className="font-medium">{dbConfig.host}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">{dbConfig.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">{dbConfig.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{dbConfig.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Password:</span>
                  <span className="font-medium">••••••••</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SSL:</span>
                  <span className="font-medium">{dbConfig.ssl ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="db-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Database Type
                  </label>
                  <select
                    id="db-type"
                    value={dbConfig.type}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mysql">MySQL</option>
                    <option value="mariadb">MariaDB</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="db-host" className="block text-sm font-medium text-gray-700 mb-1">
                    Host
                  </label>
                  <input
                    id="db-host"
                    type="text"
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, host: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., mysql.namecheap.com"
                  />
                </div>
                <div>
                  <label htmlFor="db-port" className="block text-sm font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <input
                    id="db-port"
                    type="number"
                    value={dbConfig.port}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3306"
                  />
                </div>
                <div>
                  <label htmlFor="db-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Database Name
                  </label>
                  <input
                    id="db-name"
                    type="text"
                    value={dbConfig.database}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, database: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="zynkprint"
                  />
                </div>
                <div>
                  <label htmlFor="db-username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="db-username"
                    type="text"
                    value={dbConfig.username}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="database username"
                  />
                </div>
                <div>
                  <label htmlFor="db-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="db-password"
                    type="password"
                    value={dbConfig.password}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="db-ssl"
                    type="checkbox"
                    checked={dbConfig.ssl}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, ssl: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="db-ssl" className="ml-2 block text-sm text-gray-700">
                    Enable SSL Connection
                  </label>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleSaveDbConfig}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
            
            <p className="mt-4 text-xs text-gray-500">
              * Database settings will be applied after restarting the application. Make sure your Namecheap MySQL hosting details are correct.
            </p>
          </div>
        </div>
        
        {/* ... other settings sections ... */}
      </div>
    </div>
  );
} 
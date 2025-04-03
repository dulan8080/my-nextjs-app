"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Save, X, Plus, Trash2, Pencil } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePaperTypes } from "@/contexts/PaperTypesContext";

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

interface PaperType {
  id: string;
  name: string;
}

export default function SettingsPage() {
  const { currency, setCurrency, exchangeRates, setExchangeRates } = useCurrency();
  const { paperTypes, addPaperType, removePaperType, updatePaperType } = usePaperTypes();
  const [activeTab, setActiveTab] = useState("paper-types");
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

  const [newPaperType, setNewPaperType] = useState("");
  const [editingPaperType, setEditingPaperType] = useState<{ id: string, name: string } | null>(null);
  const [editValue, setEditValue] = useState("");

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

  const handleAddPaperType = () => {
    if (newPaperType.trim()) {
      addPaperType(newPaperType);
      setNewPaperType("");
    }
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingPaperType({ id, name });
    setEditValue(name);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      updatePaperType(id, editValue);
      setEditingPaperType(null);
      setEditValue("");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="paper-types" className="space-y-6">
        <TabsList>
          <TabsTrigger value="paper-types">Paper Types</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="paper-types">
          <Card>
            <CardHeader>
              <CardTitle>Paper Types Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter paper type name"
                    value={newPaperType}
                    onChange={(e) => setNewPaperType(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddPaperType();
                      }
                    }}
                  />
                  <Button onClick={handleAddPaperType}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Paper Type
                  </Button>
                </div>

                <div className="space-y-2">
                  {paperTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      {editingPaperType?.id === type.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEdit(type.id);
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveEdit(type.id)}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingPaperType(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium">{type.name}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStartEdit(type.id, type.name)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePaperType(type.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Color management content will go here */}
              <p className="text-muted-foreground">Color management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Supplier management content will go here */}
              <p className="text-muted-foreground">Supplier management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
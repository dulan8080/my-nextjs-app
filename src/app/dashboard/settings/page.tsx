"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Save, X, Plus, Trash2, Pencil, ImageIcon, Upload } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePaperTypes } from "@/contexts/PaperTypesContext";
import { useBindingTemplates } from "@/contexts/BindingTemplatesContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface BindingTemplate {
  id: string;
  name: string;
  description: string;
  type: 'topPad' | 'sidePad' | 'sideBinding' | 'topBinding';
  imageUrl: string;
}

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
  const { bindingTemplates = [], addTemplate, removeTemplate, updateTemplate } = useBindingTemplates();
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
  const [editingPaperType, setEditingPaperType] = useState<PaperType | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "topPad",
    description: "",
    imageUrl: ""
  });
  const [editingTemplate, setEditingTemplate] = useState<BindingTemplate | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const router = useRouter();

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
  };

  const handleSaveEdit = (id: string) => {
    if (editingPaperType) {
      updatePaperType(id, editingPaperType.name);
      setEditingPaperType(null);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const saveImageFile = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  };

  const handleAddTemplate = async () => {
    if (newTemplate.name && newTemplate.type && imageFile) {
      try {
        const imageUrl = await saveImageFile(imageFile);
        addTemplate({
          name: newTemplate.name,
          type: newTemplate.type as 'topPad' | 'sidePad' | 'sideBinding' | 'topBinding',
          description: newTemplate.description,
          imageUrl
        });
        setNewTemplate({
          name: "",
          type: "topPad",
          description: "",
          imageUrl: ""
        });
        setImageFile(null);
        setPreviewUrl("");
        router.refresh();
      } catch (error) {
        console.error('Error adding template:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleUpdateTemplate = async () => {
    if (editingTemplate) {
      try {
        let imageUrl = editingTemplate.imageUrl;
        if (imageFile) {
          imageUrl = await saveImageFile(imageFile);
        }
        
        const updatedTemplate: BindingTemplate = {
          ...editingTemplate,
          name: newTemplate.name || editingTemplate.name,
          type: newTemplate.type as 'topPad' | 'sidePad' | 'sideBinding' | 'topBinding' || editingTemplate.type,
          description: newTemplate.description || editingTemplate.description,
          imageUrl
        };
        updateTemplate(editingTemplate.id, updatedTemplate);
        setEditingTemplate(null);
        setNewTemplate({
          name: "",
          type: "topPad",
          description: "",
          imageUrl: ""
        });
        setImageFile(null);
        setPreviewUrl("");
        router.refresh();
      } catch (error) {
        console.error('Error updating template:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="paper-types" className="space-y-8">
        <TabsList>
          <TabsTrigger value="paper-types">Paper Types</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="binding-templates">Binding Templates</TabsTrigger>
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
                            value={editingPaperType.name}
                            onChange={(e) => setEditingPaperType({ ...editingPaperType, name: e.target.value })}
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

        <TabsContent value="binding-templates">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Add New Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Binding Type</Label>
                    <Select
                      value={newTemplate.type}
                      onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select binding type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="topPad">Top Pad</SelectItem>
                        <SelectItem value="sidePad">Side Pad</SelectItem>
                        <SelectItem value="sideBinding">Side Binding</SelectItem>
                        <SelectItem value="topBinding">Top Binding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                      placeholder="Enter template description"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Template Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-4">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        {previewUrl ? (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Template preview"
                              className="max-h-48 rounded-lg"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-2 -right-2"
                              onClick={() => {
                                setPreviewUrl("");
                                setImageFile(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Upload an image</p>
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="template-image"
                        />
                        <Label
                          htmlFor="template-image"
                          className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                        >
                          Choose Image
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={editingTemplate ? handleUpdateTemplate : handleAddTemplate}
                className="mt-4"
              >
                {editingTemplate ? "Update Template" : "Add Template"}
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Existing Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bindingTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 space-y-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden relative group">
                      {template.imageUrl ? (
                        <>
                          <img
                            src={template.imageUrl}
                            alt={template.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/placeholder.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">Click to view</p>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8 mb-2" />
                          <span className="text-sm">No image available</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {template.type.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      {template.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {template.description}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingTemplate(template);
                          setNewTemplate({
                            name: template.name,
                            type: template.type,
                            description: template.description,
                            imageUrl: template.imageUrl
                          });
                          if (template.imageUrl) {
                            setPreviewUrl(template.imageUrl);
                          }
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => removeTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { usePaperTypes } from "@/contexts/PaperTypesContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, set } from "date-fns";
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  Clock,
  UserIcon,
  FileTextIcon,
  PaletteIcon,
  LayersIcon,
  PrinterIcon,
  SquareIcon,
  ScissorsIcon,
  BookIcon,
  PackageIcon
} from "lucide-react";

interface SpecialRequirements {
  perforation: boolean;
  scoring: boolean;
  embossing: boolean;
  foiling: boolean;
}

interface PaperItem {
  id: string;
  name: string;
  qty: number;
  cutSize: string;
  cutPerSheet: number;
}

interface PrintingMethod {
  paperSize: string;
  qty: number;
  printingSystem: string;
  printImpression: {
    value1: number;
    value2: number;
    result: number;
  };
}

interface Laminating {
  type: 'glossy' | 'matt';
  size: {
    height: number;
    width: number;
  };
  qty: number;
  unitPrice: number;
  result: number;
}

interface DieCut {
  cutter: {
    newCutter: boolean;
    oldCutter: boolean;
    creasing: boolean;
    perforating: boolean;
  };
  impression: {
    qty: number;
    unitPrice: number;
    result: number;
    manualOverride?: number;
  };
}

interface BillBookPaper {
  paperType: string;
  colors: string[];
}

interface BillBook {
  numberOfPapers: number;
  papers: BillBookPaper[];
  details: {
    billNumbers: string;
    bookNumbers: string;
    sets: number;
    qty: number;
    unitPrice: number;
    result: number;
  };
  gathering: {
    selected: boolean;
    qty: number;
    unitPrice: number;
    result: number;
  };
  binding: {
    selected: boolean;
    type: 'topPad' | 'sidePad' | 'sideBinding' | 'topBinding' | null;
    template: string | null;
    qty: number;
    unitPrice: number;
    result: number;
  };
}

interface MaterialSupply {
  supplier: 'customer' | 'supplier';
  supplierName?: string;
  items: {
    ctpPlate: boolean;
    dieCutterMaker: boolean;
    dieCutting: boolean;
    laminating: boolean;
    cutting: boolean;
  };
}

// Types for the form data
export interface OffsetPrintFormData {
  // Customer Information
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  deliveryDate: string;
  jobNumber: string;
  jobName: string;
  quantity: number;
  jobType?: string;
  notes: string;
  
  // Paper Supply
  paperSupplyByCustomer: boolean;
  paperCuttingByCustomer: boolean;
  
  // Paper Details
  paperType: string;
  colors: {
    cyan: boolean;
    magenta: boolean;
    yellow: boolean;
    black: boolean;
    fireRed: boolean;
    royalBlue: boolean;
    green: boolean;
    orange: boolean;
    violet: boolean;
    purple: boolean;
    chocolateBrown: boolean;
    coffeeBrown: boolean;
    merun: boolean;
    goldenYellow: boolean;
    gold: boolean;
    silver: boolean;
    customColor: boolean;
    customColorValue: string;
  };
  
  // Paper Items
  paperItems: PaperItem[];
  
  // Printing Methods
  printingMethod: PrintingMethod;
  
  // Laminating
  laminating: Laminating;
  
  // Die Cut
  dieCut: DieCut;
  
  // Bill Books
  billBook: BillBook;
  
  // Calendar Section (placeholder)
  calendar: {
    skip: boolean;
  };
  
  // Material Supply
  materialSupply: MaterialSupply;
}

interface OffsetPrintFormProps {
  formData: OffsetPrintFormData;
  onChange: (data: OffsetPrintFormData) => void;
}

// Add this interface for color options
interface ColorOption {
  id: string;
  name: string;
  value: string;
  isCustom?: boolean;
}

// Add this constant for color options (will be moved to settings later)
const COLOR_OPTIONS: ColorOption[] = [
  { id: 'cyan', name: 'Cyan', value: 'Cyan' },
  { id: 'magenta', name: 'Magenta', value: 'Magenta' },
  { id: 'yellow', name: 'Yellow', value: 'Yellow' },
  { id: 'black', name: 'Black', value: 'Black' },
  { id: 'fireRed', name: 'Fire Red', value: 'Fire Red' },
  { id: 'royalBlue', name: 'Royal Blue', value: 'Royal Blue' },
  { id: 'green', name: 'Green', value: 'Green' },
  { id: 'orange', name: 'Orange', value: 'Orange' },
  { id: 'violet', name: 'Violet', value: 'Violet' },
  { id: 'purple', name: 'Purple', value: 'Purple' },
  { id: 'chocolateBrown', name: 'Chocolate Brown', value: 'Chocolate Brown' },
  { id: 'coffeeBrown', name: 'Coffee Brown', value: 'Coffee Brown' },
  { id: 'merun', name: 'Merun', value: 'Merun' },
  { id: 'goldenYellow', name: 'Golden Yellow', value: 'Golden Yellow' },
  { id: 'gold', name: 'Gold', value: 'Gold' },
  { id: 'silver', name: 'Silver', value: 'Silver' },
  { id: 'custom', name: 'Custom Color', value: '', isCustom: true }
];

const steps = [
  { id: 1, name: "Customer Information", icon: UserIcon },
  { id: 2, name: "Paper Supply", icon: FileTextIcon },
  { id: 3, name: "Colors", icon: PaletteIcon },
  { id: 4, name: "Paper Items", icon: LayersIcon },
  { id: 5, name: "Printing Methods", icon: PrinterIcon },
  { id: 6, name: "Laminating", icon: SquareIcon },
  { id: 7, name: "Die Cut", icon: ScissorsIcon },
  { id: 8, name: "Bill Books", icon: BookIcon },
  { id: 9, name: "Calendar", icon: CalendarIcon },
  { id: 10, name: "Material Supply", icon: PackageIcon }
];

const BINDING_TYPES = [
  { id: 'topPad', name: 'TOP PAD' },
  { id: 'sidePad', name: 'SIDE PAD' },
  { id: 'sideBinding', name: 'SIDE BINDING' },
  { id: 'topBinding', name: 'TOP BINDING' }
];

const MATERIAL_ITEMS = [
  { id: 'ctpPlate', name: 'CTP Plate' },
  { id: 'dieCutterMaker', name: 'Die Cutter Maker' },
  { id: 'dieCutting', name: 'Die Cutting' },
  { id: 'laminating', name: 'Laminating' },
  { id: 'cutting', name: 'Cutting' }
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const OffsetPrintForm = ({ formData, onChange }: OffsetPrintFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { paperTypes } = usePaperTypes();
  const [showBindingTemplate, setShowBindingTemplate] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFormData, setLocalFormData] = useState<OffsetPrintFormData>({
    customerId: formData.customerId || '',
    customerName: formData.customerName || '',
    customerEmail: formData.customerEmail || '',
    customerPhone: formData.customerPhone || '',
    customerAddress: formData.customerAddress || '',
    deliveryDate: formData.deliveryDate || '',
    jobNumber: formData.jobNumber || '',
    jobName: formData.jobName || '',
    quantity: formData.quantity || 0,
    jobType: formData.jobType || '',
    notes: formData.notes || '',
    paperSupplyByCustomer: formData.paperSupplyByCustomer || false,
    paperCuttingByCustomer: formData.paperCuttingByCustomer || false,
    paperType: formData.paperType || '',
    colors: formData.colors || {
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
      customColorValue: ''
    },
    paperItems: formData.paperItems || [],
    printingMethod: formData.printingMethod || {
      paperSize: '',
      qty: 0,
      printingSystem: '',
      printImpression: {
        value1: 0,
        value2: 0,
        result: 0
      }
    },
    laminating: formData.laminating || {
      type: 'glossy',
      size: {
        height: 0,
        width: 0
      },
      qty: 0,
      unitPrice: 0,
      result: 0
    },
    dieCut: formData.dieCut || {
      cutter: {
        newCutter: false,
        oldCutter: false,
        creasing: false,
        perforating: false
      },
      impression: {
        qty: 0,
        unitPrice: 0,
        result: 0
      }
    },
    billBook: formData.billBook || {
      numberOfPapers: 1,
      papers: [],
      details: {
        billNumbers: '',
        bookNumbers: '',
        sets: 0,
        qty: 0,
        unitPrice: 0,
        result: 0
      },
      gathering: {
        selected: false,
        qty: 0,
        unitPrice: 0,
        result: 0
      },
      binding: {
        selected: false,
        type: null,
        template: null,
        qty: 0,
        unitPrice: 0,
        result: 0
      }
    },
    calendar: formData.calendar || {
      skip: false
    },
    materialSupply: formData.materialSupply || {
      supplier: 'customer',
      items: {
        ctpPlate: false,
        dieCutterMaker: false,
        dieCutting: false,
        laminating: false,
        cutting: false
      }
    }
  });
  const [date, setDate] = useState<Date | undefined>(() => {
    const now = new Date();
    return formData.deliveryDate ? new Date(formData.deliveryDate) : now;
  });

  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes()
    };
  });

  // Update local form data when prop changes
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    const updatedData = {
      ...localFormData,
      [field]: value
    };
    setLocalFormData(updatedData);
    onChange(updatedData);
  };

  const handleColorChange = (colorId: string, checked: boolean) => {
    const newColors = { ...localFormData.colors };
    if (colorId === "custom") {
      newColors.custom = checked;
      if (!checked) {
        newColors.customColorValue = "";
      }
    } else {
      newColors[colorId as keyof typeof newColors] = checked;
    }
    handleChange("colors", newColors);
  };

  const handleAddPaperItem = () => {
    const newPaperItem: PaperItem = {
      id: Date.now().toString(),
      name: '',
      qty: 0,
      cutSize: '',
      cutPerSheet: 0
    };
    handleChange('paperItems', [...localFormData.paperItems, newPaperItem]);
  };

  const handleRemovePaperItem = (id: string) => {
    handleChange('paperItems', localFormData.paperItems.filter(item => item.id !== id));
  };

  const handlePaperItemChange = (id: string, field: keyof PaperItem, value: any) => {
    const updatedItems = localFormData.paperItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    handleChange('paperItems', updatedItems);
  };

  const handleDateTimeChange = (newDate?: Date, newTime?: { hours: number; minutes: number }) => {
    const updatedDate = newDate || date;
    const updatedTime = newTime || selectedTime;
    
    if (updatedDate) {
      const combinedDateTime = set(updatedDate, {
        hours: updatedTime.hours,
        minutes: updatedTime.minutes
      });
      setDate(combinedDateTime);
      handleChange("deliveryDate", combinedDateTime.toISOString());
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    setSelectedTime({ hours, minutes });
    handleDateTimeChange(date, { hours, minutes });
  };

  const handleSubmit = () => {
    setShowSummary(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to add to print queue
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setShowSummary(false);
      // Reset form or navigate to print queue
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <nav className="relative mb-20 pt-4 pb-16">
        <div className="absolute left-0 right-0 h-0.5 top-[2.25rem] transform -translate-y-1/2 bg-muted" />
        <ol className="relative z-10 flex justify-between px-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.id} className="flex flex-col items-center relative group w-20">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200",
                    currentStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground",
                    currentStep === step.id && "ring-2 ring-offset-2 ring-primary"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div
                  className={cn(
                    "absolute top-16 text-center text-xs font-medium min-h-[2.5rem] flex items-center justify-center px-1 w-24",
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className="line-clamp-2">{step.name}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Form Content */}
      <div className="bg-card rounded-lg shadow-sm p-8 mt-8 space-y-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="customerName" className="text-base">Customer Name</Label>
                <Input
                  id="customerName"
                  value={localFormData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="customerPhone" className="text-base">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={localFormData.customerPhone}
                  onChange={(e) => handleChange("customerPhone", e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="customerAddress" className="text-base">Address</Label>
              <Textarea
                id="customerAddress"
                value={localFormData.customerAddress}
                onChange={(e) => handleChange("customerAddress", e.target.value)}
                placeholder="Enter customer address"
                className="w-full min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="deliveryDate" className="text-base">Delivery Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        <span>
                          {format(date, "PPP")} at {format(date, "HH:mm")}
                        </span>
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Select date and time</p>
                        <Clock className="h-4 w-4 opacity-50" />
                      </div>
                    </div>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => handleDateTimeChange(newDate)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="rounded-md border shadow-sm"
                      classNames={{
                        months: "space-y-4 p-3",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: cn(
                          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        ),
                        day: cn(
                          "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                          "hover:bg-accent hover:text-accent-foreground"
                        ),
                        day_selected:
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_hidden: "invisible",
                      }}
                      components={{
                        IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
                        IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
                      }}
                    />
                    <div className="p-4 border-t border-border">
                      <div className="flex items-end gap-2">
                        <div className="grid gap-1 flex-1">
                          <Label htmlFor="hours" className="text-xs">Hours</Label>
                          <Input
                            id="hours"
                            className="h-8"
                            type="number"
                            min={0}
                            max={23}
                            value={selectedTime.hours}
                            onChange={(e) => handleTimeChange(
                              parseInt(e.target.value) || 0,
                              selectedTime.minutes
                            )}
                          />
                        </div>
                        <div className="grid gap-1 flex-1">
                          <Label htmlFor="minutes" className="text-xs">Minutes</Label>
                          <Input
                            id="minutes"
                            className="h-8"
                            type="number"
                            min={0}
                            max={59}
                            value={selectedTime.minutes}
                            onChange={(e) => handleTimeChange(
                              selectedTime.hours,
                              parseInt(e.target.value) || 0
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-3">
                <Label htmlFor="jobNumber" className="text-base">Job Number</Label>
                <Input
                  id="jobNumber"
                  value={localFormData.jobNumber}
                  onChange={(e) => handleChange("jobNumber", e.target.value)}
                  placeholder="Enter job number"
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="jobName" className="text-base">Job Name</Label>
                <Input
                  id="jobName"
                  value={localFormData.jobName}
                  onChange={(e) => handleChange("jobName", e.target.value)}
                  placeholder="Enter job name"
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="quantity" className="text-base font-semibold text-primary">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={localFormData.quantity}
                  onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
                  placeholder="Enter quantity"
                  className="w-full border-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paperSupplyByCustomer"
                  checked={localFormData.paperSupplyByCustomer}
                  onCheckedChange={(checked) =>
                    handleChange("paperSupplyByCustomer", checked)
                  }
                />
                <Label htmlFor="paperSupplyByCustomer" className="text-base">
                  Paper Supply by Customer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paperCuttingByCustomer"
                  checked={localFormData.paperCuttingByCustomer}
                  onCheckedChange={(checked) =>
                    handleChange("paperCuttingByCustomer", checked)
                  }
                />
                <Label htmlFor="paperCuttingByCustomer" className="text-base">
                  Paper Cutting by Customer
                </Label>
              </div>
            </div>
            {!localFormData.paperSupplyByCustomer && (
              <div className="space-y-2">
                <Label htmlFor="paperType">Paper Type</Label>
                <Select
                  value={localFormData.paperType}
                  onValueChange={(value) => handleChange("paperType", value)}
                  disabled={localFormData.paperSupplyByCustomer}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select paper type" />
                  </SelectTrigger>
                  <SelectContent>
                    {paperTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Label className="text-lg font-semibold">Colors</Label>
            <div className="grid grid-cols-2 gap-4">
              {COLOR_OPTIONS.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={color.id}
                    checked={localFormData.colors[color.id as keyof typeof localFormData.colors]}
                    onCheckedChange={(checked) =>
                      handleColorChange(color.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={color.id} className="text-base">
                    {color.name}
                  </Label>
                  {color.isCustom && localFormData.colors.custom && (
                    <Input
                      value={localFormData.colors.customColorValue}
                      onChange={(e) =>
                        handleChange("colors", {
                          ...localFormData.colors,
                          customColorValue: e.target.value,
                        })
                      }
                      placeholder="Enter custom color"
                      className="ml-2 flex-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Paper Items</Label>
              <Button onClick={handleAddPaperItem}>Add Item</Button>
            </div>
            <div className="space-y-4">
              {localFormData.paperItems.map((item) => (
                <div key={item.id} className="grid grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Paper Type</Label>
                    <Select
                      value={item.name}
                      onValueChange={(value) => handlePaperItemChange(item.id, 'name', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select paper type" />
                      </SelectTrigger>
                      <SelectContent>
                        {paperTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handlePaperItemChange(item.id, 'qty', parseInt(e.target.value))}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cut Size</Label>
                    <Input
                      value={item.cutSize}
                      onChange={(e) => handlePaperItemChange(item.id, 'cutSize', e.target.value)}
                      placeholder="Enter cut size"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cut Per Sheet</Label>
                    <Input
                      type="number"
                      value={item.cutPerSheet}
                      onChange={(e) => handlePaperItemChange(item.id, 'cutPerSheet', parseInt(e.target.value))}
                      placeholder="Enter cut per sheet"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemovePaperItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paper Size</Label>
                <Input
                  value={localFormData.printingMethod?.paperSize || ''}
                  onChange={(e) => handleChange('printingMethod', {
                    ...(localFormData.printingMethod || {}),
                    paperSize: e.target.value
                  })}
                  placeholder="Enter paper size"
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={localFormData.printingMethod?.qty || 0}
                  onChange={(e) => handleChange('printingMethod', {
                    ...(localFormData.printingMethod || {}),
                    qty: parseInt(e.target.value) || 0
                  })}
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Printing System</Label>
              <Input
                value={localFormData.printingMethod?.printingSystem || ''}
                onChange={(e) => handleChange('printingMethod', {
                  ...(localFormData.printingMethod || {}),
                    printingSystem: e.target.value
                })}
                placeholder="Enter printing system"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Value 1</Label>
                <Input
                  type="number"
                  value={localFormData.printingMethod?.printImpression?.value1 || 0}
                  onChange={(e) => handleChange('printingMethod', {
                    ...(localFormData.printingMethod || {}),
                    printImpression: {
                      ...(localFormData.printingMethod?.printImpression || {}),
                      value1: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Value 2</Label>
                <Input
                  type="number"
                  value={localFormData.printingMethod?.printImpression?.value2 || 0}
                  onChange={(e) => handleChange('printingMethod', {
                    ...(localFormData.printingMethod || {}),
                    printImpression: {
                      ...(localFormData.printingMethod?.printImpression || {}),
                      value2: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Result</Label>
                <Input
                  type="number"
                  value={localFormData.printingMethod?.printImpression?.result || 0}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Laminating Type</Label>
              <RadioGroup
                value={localFormData.laminating?.type || 'glossy'}
                onValueChange={(value) => handleChange('laminating', {
                  ...(localFormData.laminating || {}),
                  type: value as 'glossy' | 'matt'
                })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="glossy" id="glossy" />
                  <Label htmlFor="glossy">Glossy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="matt" id="matt" />
                  <Label htmlFor="matt">Matt</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Height</Label>
                <Input
                  type="number"
                  value={localFormData.laminating?.size?.height || 0}
                  onChange={(e) => handleChange('laminating', {
                    ...(localFormData.laminating || {}),
                    size: {
                      ...(localFormData.laminating?.size || {}),
                      height: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Width</Label>
                <Input
                  type="number"
                  value={localFormData.laminating?.size?.width || 0}
                  onChange={(e) => handleChange('laminating', {
                    ...(localFormData.laminating || {}),
                    size: {
                      ...(localFormData.laminating?.size || {}),
                      width: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={localFormData.laminating?.qty || 0}
                  onChange={(e) => handleChange('laminating', {
                    ...(localFormData.laminating || {}),
                    qty: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  value={localFormData.laminating?.unitPrice || 0}
                  onChange={(e) => handleChange('laminating', {
                    ...(localFormData.laminating || {}),
                    unitPrice: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Result</Label>
              <Input
                type="number"
                value={localFormData.laminating?.result || 0}
                readOnly
              />
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cutter Selection</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newCutter"
                    checked={localFormData.dieCut.cutter.newCutter}
                    onCheckedChange={(checked) => handleChange('dieCut', {
                      ...localFormData.dieCut,
                      cutter: {
                        ...localFormData.dieCut.cutter,
                        newCutter: checked as boolean
                      }
                    })}
                  />
                  <Label htmlFor="newCutter">New Cutter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oldCutter"
                    checked={localFormData.dieCut.cutter.oldCutter}
                    onCheckedChange={(checked) => handleChange('dieCut', {
                      ...localFormData.dieCut,
                      cutter: {
                        ...localFormData.dieCut.cutter,
                        oldCutter: checked as boolean
                      }
                    })}
                  />
                  <Label htmlFor="oldCutter">Old Cutter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="creasing"
                    checked={localFormData.dieCut.cutter.creasing}
                    onCheckedChange={(checked) => handleChange('dieCut', {
                      ...localFormData.dieCut,
                      cutter: {
                        ...localFormData.dieCut.cutter,
                        creasing: checked as boolean
                      }
                    })}
                  />
                  <Label htmlFor="creasing">Creasing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perforating"
                    checked={localFormData.dieCut.cutter.perforating}
                    onCheckedChange={(checked) => handleChange('dieCut', {
                      ...localFormData.dieCut,
                      cutter: {
                        ...localFormData.dieCut.cutter,
                        perforating: checked as boolean
                      }
                    })}
                  />
                  <Label htmlFor="perforating">Perforating</Label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={localFormData.dieCut.impression.qty}
                  onChange={(e) => handleChange('dieCut', {
                    ...localFormData.dieCut,
                    impression: {
                      ...localFormData.dieCut.impression,
                      qty: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  value={localFormData.dieCut.impression.unitPrice}
                  onChange={(e) => handleChange('dieCut', {
                    ...localFormData.dieCut,
                    impression: {
                      ...localFormData.dieCut.impression,
                      unitPrice: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Result</Label>
                <Input
                  type="number"
                  value={localFormData.dieCut.impression.result}
                  onChange={(e) => handleChange('dieCut', {
                    ...localFormData.dieCut,
                    impression: {
                      ...localFormData.dieCut.impression,
                      manualOverride: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Bill Books</Label>
              <Button variant="outline" onClick={() => setCurrentStep(currentStep + 1)}>
                Skip
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Number of Papers</Label>
                <Select
                  value={(localFormData.billBook?.numberOfPapers || 1).toString()}
                  onValueChange={(value) => handleChange('billBook', {
                    ...(localFormData.billBook || {}),
                    numberOfPapers: parseInt(value) || 1,
                    papers: Array(parseInt(value) || 1).fill({ paperType: '', colors: [] })
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of papers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Papers
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {Array.from({ length: localFormData.billBook?.numberOfPapers || 1 }).map((_, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-medium">Paper {index + 1}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Paper Type</Label>
                      <Select
                        value={localFormData.billBook?.papers?.[index]?.paperType || ''}
                        onValueChange={(value) => {
                          const newPapers = [...(localFormData.billBook?.papers || [])];
                          newPapers[index] = {
                            ...(newPapers[index] || {}),
                            paperType: value,
                            colors: newPapers[index]?.colors || []
                          };
                          handleChange('billBook', {
                            ...(localFormData.billBook || {}),
                            papers: newPapers
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select paper type" />
                        </SelectTrigger>
                        <SelectContent>
                          {paperTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Colors</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {COLOR_OPTIONS.map((color) => (
                          <div key={color.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${index}-${color.id}`}
                              checked={localFormData.billBook?.papers?.[index]?.colors?.includes(color.id) || false}
                              onCheckedChange={(checked) => {
                                const newPapers = [...(localFormData.billBook?.papers || [])];
                                const colors = newPapers[index]?.colors || [];
                                if (checked) {
                                  colors.push(color.id);
                                } else {
                                  const colorIndex = colors.indexOf(color.id);
                                  if (colorIndex > -1) {
                                    colors.splice(colorIndex, 1);
                                  }
                                }
                                newPapers[index] = {
                                  ...(newPapers[index] || {}),
                                  colors,
                                  paperType: newPapers[index]?.paperType || ''
                                };
                                handleChange('billBook', {
                                  ...(localFormData.billBook || {}),
                                  papers: newPapers
                                });
                              }}
                            />
                            <Label htmlFor={`${index}-${color.id}`}>{color.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bill Numbers</Label>
                    <Input
                      value={localFormData.billBook?.details?.billNumbers || ''}
                      onChange={(e) => handleChange('billBook', {
                        ...(localFormData.billBook || {}),
                        details: {
                          ...(localFormData.billBook?.details || {}),
                          billNumbers: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Book Numbers</Label>
                    <Input
                      value={localFormData.billBook?.details?.bookNumbers || ''}
                      onChange={(e) => handleChange('billBook', {
                        ...(localFormData.billBook || {}),
                        details: {
                          ...(localFormData.billBook?.details || {}),
                          bookNumbers: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sets</Label>
                    <Input
                      type="number"
                      value={localFormData.billBook?.details?.sets || 0}
                      onChange={(e) => handleChange('billBook', {
                        ...(localFormData.billBook || {}),
                        details: {
                          ...(localFormData.billBook?.details || {}),
                          sets: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={localFormData.billBook?.details?.qty || 0}
                      onChange={(e) => handleChange('billBook', {
                        ...(localFormData.billBook || {}),
                        details: {
                          ...(localFormData.billBook?.details || {}),
                          qty: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      value={localFormData.billBook?.details?.unitPrice || 0}
                      onChange={(e) => handleChange('billBook', {
                        ...(localFormData.billBook || {}),
                        details: {
                          ...(localFormData.billBook?.details || {}),
                          unitPrice: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <Input
                      type="number"
                      value={localFormData.billBook?.details?.result || 0}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Binding Options</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gathering"
                          checked={localFormData.billBook?.gathering?.selected || false}
                          onCheckedChange={(checked) => handleChange('billBook', {
                            ...(localFormData.billBook || {}),
                            gathering: {
                              ...(localFormData.billBook?.gathering || {}),
                              selected: checked as boolean
                            }
                          })}
                        />
                        <Label htmlFor="gathering">Gathering</Label>
                      </div>
                      {localFormData.billBook?.gathering?.selected && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={localFormData.billBook?.gathering?.qty || 0}
                              onChange={(e) => handleChange('billBook', {
                                ...(localFormData.billBook || {}),
                                gathering: {
                                  ...(localFormData.billBook?.gathering || {}),
                                  qty: parseInt(e.target.value) || 0
                                }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit Price</Label>
                            <Input
                              type="number"
                              value={localFormData.billBook?.gathering?.unitPrice || 0}
                              onChange={(e) => handleChange('billBook', {
                                ...(localFormData.billBook || {}),
                                gathering: {
                                  ...(localFormData.billBook?.gathering || {}),
                                  unitPrice: parseInt(e.target.value) || 0
                                }
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="binding"
                          checked={localFormData.billBook?.binding?.selected || false}
                          onCheckedChange={(checked) => handleChange('billBook', {
                            ...(localFormData.billBook || {}),
                            binding: {
                              ...(localFormData.billBook?.binding || {}),
                              selected: checked as boolean
                            }
                          })}
                        />
                        <Label htmlFor="binding">Binding</Label>
                      </div>
                      {localFormData.billBook?.binding?.selected && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Binding Type</Label>
                            <Select
                              value={localFormData.billBook?.binding?.type || ''}
                              onValueChange={(value) => {
                                handleChange('billBook', {
                                  ...(localFormData.billBook || {}),
                                  binding: {
                                    ...(localFormData.billBook?.binding || {}),
                                    type: value as 'topPad' | 'sidePad' | 'sideBinding' | 'topBinding'
                                  }
                                });
                                setShowBindingTemplate(true);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select binding type" />
                              </SelectTrigger>
                              <SelectContent>
                                {BINDING_TYPES.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                value={localFormData.billBook?.binding?.qty || 0}
                                onChange={(e) => handleChange('billBook', {
                                  ...(localFormData.billBook || {}),
                                  binding: {
                                    ...(localFormData.billBook?.binding || {}),
                                    qty: parseInt(e.target.value) || 0
                                  }
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Unit Price</Label>
                              <Input
                                type="number"
                                value={localFormData.billBook?.binding?.unitPrice || 0}
                                onChange={(e) => handleChange('billBook', {
                                  ...(localFormData.billBook || {}),
                                  binding: {
                                    ...(localFormData.billBook?.binding || {}),
                                    unitPrice: parseInt(e.target.value) || 0
                                  }
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Calendar Section</Label>
              <Button variant="outline" onClick={() => setCurrentStep(currentStep + 1)}>
                Skip
              </Button>
            </div>
            {/* Calendar section content will be added later */}
          </div>
        )}

        {currentStep === 10 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Material Supply</Label>
              <div className="space-y-4">
                {MATERIAL_ITEMS.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">{item.name}</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={localFormData.materialSupply?.items?.[item.id]?.supplier === 'customer' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange('materialSupply', {
                            ...(localFormData.materialSupply || {}),
                            items: {
                              ...(localFormData.materialSupply?.items || {}),
                              [item.id]: {
                                ...(localFormData.materialSupply?.items?.[item.id] || {}),
                                supplier: 'customer',
                                supplierName: ''
                              }
                            }
                          })}
                        >
                          Customer
                        </Button>
                        <Button
                          variant={localFormData.materialSupply?.items?.[item.id]?.supplier === 'supplier' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange('materialSupply', {
                            ...(localFormData.materialSupply || {}),
                            items: {
                              ...(localFormData.materialSupply?.items || {}),
                              [item.id]: {
                                ...(localFormData.materialSupply?.items?.[item.id] || {}),
                                supplier: 'supplier',
                                supplierName: ''
                              }
                            }
                          })}
                        >
                          Supplier
                        </Button>
                      </div>
                    </div>
                    {localFormData.materialSupply?.items?.[item.id]?.supplier === 'supplier' && (
                      <div className="space-y-2">
                        <Label>Supplier Name</Label>
                        <Input
                          value={localFormData.materialSupply?.items?.[item.id]?.supplierName || ''}
                          onChange={(e) => handleChange('materialSupply', {
                            ...(localFormData.materialSupply || {}),
                            items: {
                              ...(localFormData.materialSupply?.items || {}),
                              [item.id]: {
                                ...(localFormData.materialSupply?.items?.[item.id] || {}),
                                supplierName: e.target.value
                              }
                            }
                          })}
                          placeholder="Enter supplier name"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 mt-8 border-t">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          disabled={currentStep === 1}
          className="px-6"
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            if (currentStep === steps.length) {
              handleSubmit();
            } else {
              setCurrentStep((prev) => Math.min(prev + 1, steps.length));
            }
          }}
          className="px-6"
        >
          {currentStep === steps.length ? "Submit" : "Next"}
        </Button>
      </div>

      {showBindingTemplate && (
        <Dialog open={showBindingTemplate} onOpenChange={setShowBindingTemplate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Binding Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={`/templates/${localFormData.billBook.binding.type}.png`}
                alt={`${localFormData.billBook.binding.type} binding template`}
                className="w-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Submission Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Submission Summary</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Customer Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p>{localFormData.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p>{localFormData.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p>{localFormData.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Job Number</p>
                  <p>{localFormData.jobNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Job Name</p>
                  <p>{localFormData.jobName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="text-primary font-semibold">{localFormData.quantity}</p>
                </div>
              </div>
            </div>

            {/* Paper Supply */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Paper Supply</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paper Supply by Customer</p>
                  <p>{localFormData.paperSupplyByCustomer ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paper Cutting by Customer</p>
                  <p>{localFormData.paperCuttingByCustomer ? 'Yes' : 'No'}</p>
                </div>
                {!localFormData.paperSupplyByCustomer && (
                  <div>
                    <p className="text-sm text-muted-foreground">Paper Type</p>
                    <p>{localFormData.paperType}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(localFormData.colors)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <span key={key} className="px-2 py-1 bg-primary/10 rounded-full text-sm">
                      {key}
                    </span>
                  ))}
              </div>
            </div>

            {/* Paper Items */}
            {localFormData.paperItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Paper Items</h3>
                <div className="space-y-4">
                  {localFormData.paperItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-2 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p>{item.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p>{item.qty}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cut Size</p>
                        <p>{item.cutSize}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cut Per Sheet</p>
                        <p>{item.cutPerSheet}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Printing Method */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Printing Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paper Size</p>
                  <p>{localFormData.printingMethod?.paperSize}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p>{localFormData.printingMethod?.qty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Printing System</p>
                  <p>{localFormData.printingMethod?.printingSystem}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Print Impression</p>
                  <p>{localFormData.printingMethod?.printImpression?.result}</p>
                </div>
              </div>
            </div>

            {/* Material Supply */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Material Supply</h3>
              <div className="space-y-4">
                {MATERIAL_ITEMS.map((item) => {
                  const material = localFormData.materialSupply?.items?.[item.id];
                  if (!material) return null;
                  return (
                    <div key={item.id} className="grid grid-cols-2 gap-4 p-2 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm text-muted-foreground">Material</p>
                        <p>{item.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Supplier</p>
                        <p>{material.supplier === 'customer' ? 'Customer' : material.supplierName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSummary(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Adding to Print Queue...' : 'Add to Print Queue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 
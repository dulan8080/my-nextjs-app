"use client";

import { useState } from "react";

export interface DigitalPrintFormProps {
  formData: {
    rollWidth: string;
    printWidth: string;
    printHeight: string;
    offCut: string;
    isManualOffCut: boolean;
    poleMounting: boolean;
    poleSide: string;
    laminating: boolean;
    laminatingWidth: string;
    laminatingHeight: string;
    laminatingOffCut: string;
    hasSpace: boolean;
    hasPocket: boolean;
    pocketSize: string;
    isPrintAndCut: boolean;
    finishingRemarks: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: {
    rollWidth?: string;
    printWidth?: string;
    printHeight?: string;
    offCut?: string;
    poleSide?: string;
    laminatingWidth?: string;
    laminatingHeight?: string;
    laminatingOffCut?: string;
    pocketSize?: string;
    finishingRemarks?: string;
  };
  calculateOffCut: () => void;
}

// Helper function to create synthetic change events
const createSyntheticEvent = (name: string, value: any): React.ChangeEvent<HTMLInputElement> => {
  return {
    target: { name, value } as any,
    currentTarget: { name, value } as any,
    preventDefault: () => {},
    stopPropagation: () => {},
    nativeEvent: {} as any,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    timeStamp: Date.now(),
    type: "change",
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};

// Mock roll width options - would be fetched from settings in real app
const ROLL_WIDTHS = ["24", "36", "42", "60"];

export const DigitalPrintForm = ({
  formData,
  onChange,
  errors,
  calculateOffCut,
}: DigitalPrintFormProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes separately
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Create a synthetic event to trigger onChange
      const event = createSyntheticEvent(name, checked);
      
      onChange(event);
      return;
    }
    
    onChange(e);
    
    // Recalculate offcut when values change
    if (
      (name === "rollWidth" || name === "printWidth" || name === "printHeight") &&
      !formData.isManualOffCut
    ) {
      // Slight delay to ensure state is updated
      setTimeout(() => {
        calculateOffCut();
      }, 10);
    }
  };

  const handleManualOffCutToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    
    // Create a synthetic event to trigger onChange
    const event = createSyntheticEvent("isManualOffCut", checked);
    
    onChange(event);
    
    // If toggling back to automatic, recalculate
    if (!checked) {
      setTimeout(() => {
        calculateOffCut();
      }, 10);
    }
  };

  const handlePoleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    
    // Create a synthetic event to trigger onChange
    const event = createSyntheticEvent("poleMounting", checked);
    
    onChange(event);
    
    // If unchecking, clear the pole side value
    if (!checked) {
      const sideEvent = createSyntheticEvent("poleSide", "");
      
      onChange(sideEvent);
    }
  };

  const handleLaminatingToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    
    // Create a synthetic event to trigger onChange
    const event = createSyntheticEvent("laminating", checked);
    
    onChange(event);
    
    // If unchecking, clear laminating fields
    if (!checked) {
      const widthEvent = createSyntheticEvent("laminatingWidth", "");
      onChange(widthEvent);
      
      const heightEvent = createSyntheticEvent("laminatingHeight", "");
      onChange(heightEvent);
      
      const offCutEvent = createSyntheticEvent("laminatingOffCut", "");
      onChange(offCutEvent);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Digital Print Specifications
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Roll Size and Print Dimensions */}
        <div className="sm:col-span-2">
          <label
            htmlFor="rollWidth"
            className="block text-sm font-medium text-gray-700"
          >
            Roll Width (inches)
          </label>
          <div className="mt-1">
            <select
              id="rollWidth"
              name="rollWidth"
              value={formData.rollWidth}
              onChange={handleChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                errors.rollWidth ? "ring-red-500" : "ring-gray-300"
              } focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
            >
              <option value="">Select roll width</option>
              {ROLL_WIDTHS.map((width) => (
                <option key={width} value={width}>
                  {width}"
                </option>
              ))}
            </select>
          </div>
          {errors.rollWidth && (
            <p className="mt-2 text-sm text-red-600" id="rollWidth-error">
              {errors.rollWidth}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="printWidth"
            className="block text-sm font-medium text-gray-700"
          >
            Print Width (inches)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="printWidth"
              name="printWidth"
              value={formData.printWidth}
              onChange={handleChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                errors.printWidth ? "ring-red-500" : "ring-gray-300"
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
            />
          </div>
          {errors.printWidth && (
            <p className="mt-2 text-sm text-red-600" id="printWidth-error">
              {errors.printWidth}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="printHeight"
            className="block text-sm font-medium text-gray-700"
          >
            Print Height (inches)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="printHeight"
              name="printHeight"
              value={formData.printHeight}
              onChange={handleChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                errors.printHeight ? "ring-red-500" : "ring-gray-300"
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
            />
          </div>
          {errors.printHeight && (
            <p className="mt-2 text-sm text-red-600" id="printHeight-error">
              {errors.printHeight}
            </p>
          )}
        </div>

        {/* Off-cut */}
        <div className="sm:col-span-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="offCut"
              className="block text-sm font-medium text-gray-700"
            >
              Off-cut (inches)
            </label>
            <div className="flex items-center">
              <input
                id="isManualOffCut"
                name="isManualOffCut"
                type="checkbox"
                checked={formData.isManualOffCut}
                onChange={handleManualOffCutToggle}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="isManualOffCut"
                className="ml-2 text-sm text-gray-500"
              >
                Manual adjustment
              </label>
            </div>
          </div>
          <div className="mt-1">
            <input
              type="text"
              id="offCut"
              name="offCut"
              value={formData.offCut}
              onChange={handleChange}
              readOnly={!formData.isManualOffCut}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                errors.offCut ? "ring-red-500" : "ring-gray-300"
              } ${!formData.isManualOffCut ? "bg-gray-100" : ""} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
            />
          </div>
          {errors.offCut && (
            <p className="mt-2 text-sm text-red-600" id="offCut-error">
              {errors.offCut}
            </p>
          )}
        </div>

        {/* Pole Mounting */}
        <div className="sm:col-span-3">
          <div className="flex items-center">
            <input
              id="poleMounting"
              name="poleMounting"
              type="checkbox"
              checked={formData.poleMounting}
              onChange={handlePoleToggle}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="poleMounting"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Pole Mounting
            </label>
          </div>
          
          {formData.poleMounting && (
            <div className="mt-2">
              <label
                htmlFor="poleSide"
                className="block text-sm font-medium text-gray-700"
              >
                Pole Side
              </label>
              <select
                id="poleSide"
                name="poleSide"
                value={formData.poleSide}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                  errors.poleSide ? "ring-red-500" : "ring-gray-300"
                } focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
              >
                <option value="">Select side</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              {errors.poleSide && (
                <p className="mt-2 text-sm text-red-600" id="poleSide-error">
                  {errors.poleSide}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Laminating */}
        <div className="sm:col-span-6">
          <div className="flex items-center">
            <input
              id="laminating"
              name="laminating"
              type="checkbox"
              checked={formData.laminating}
              onChange={handleLaminatingToggle}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="laminating"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Laminating
            </label>
          </div>
          
          {formData.laminating && (
            <div className="mt-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="laminatingWidth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Laminating Width (inches)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="laminatingWidth"
                    name="laminatingWidth"
                    value={formData.laminatingWidth}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                      errors.laminatingWidth ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                {errors.laminatingWidth && (
                  <p className="mt-2 text-sm text-red-600" id="laminatingWidth-error">
                    {errors.laminatingWidth}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="laminatingHeight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Laminating Height (inches)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="laminatingHeight"
                    name="laminatingHeight"
                    value={formData.laminatingHeight}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                      errors.laminatingHeight ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                {errors.laminatingHeight && (
                  <p className="mt-2 text-sm text-red-600" id="laminatingHeight-error">
                    {errors.laminatingHeight}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="laminatingOffCut"
                  className="block text-sm font-medium text-gray-700"
                >
                  Laminating Off-cut (inches)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="laminatingOffCut"
                    name="laminatingOffCut"
                    value={formData.laminatingOffCut}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                      errors.laminatingOffCut ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                {errors.laminatingOffCut && (
                  <p className="mt-2 text-sm text-red-600" id="laminatingOffCut-error">
                    {errors.laminatingOffCut}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Finishing Options */}
        <div className="sm:col-span-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Additional Finishing Options
          </h4>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="hasSpace"
                name="hasSpace"
                type="checkbox"
                checked={formData.hasSpace}
                onChange={(e) => {
                  onChange(createSyntheticEvent("hasSpace", e.target.checked));
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="hasSpace"
                className="ml-2 block text-sm text-gray-700"
              >
                Space Only
              </label>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="hasPocket"
                  name="hasPocket"
                  type="checkbox"
                  checked={formData.hasPocket}
                  onChange={(e) => {
                    onChange(createSyntheticEvent("hasPocket", e.target.checked));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="hasPocket"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Pocket
                </label>
              </div>
              
              {formData.hasPocket && (
                <div className="mt-2 ml-6">
                  <label
                    htmlFor="pocketSize"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pocket Size (inches)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="pocketSize"
                      name="pocketSize"
                      value={formData.pocketSize}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                        errors.pocketSize ? "ring-red-500" : "ring-gray-300"
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                      placeholder="e.g., 2"
                    />
                  </div>
                  {errors.pocketSize && (
                    <p className="mt-2 text-sm text-red-600" id="pocketSize-error">
                      {errors.pocketSize}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="isPrintAndCut"
                name="isPrintAndCut"
                type="checkbox"
                checked={formData.isPrintAndCut}
                onChange={(e) => {
                  onChange(createSyntheticEvent("isPrintAndCut", e.target.checked));
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="isPrintAndCut"
                className="ml-2 block text-sm text-gray-700"
              >
                Print and Cut
              </label>
            </div>
          </div>
        </div>

        {/* Finishing Remarks */}
        <div className="sm:col-span-6">
          <label
            htmlFor="finishingRemarks"
            className="block text-sm font-medium text-gray-700"
          >
            Finishing Remarks
          </label>
          <div className="mt-1">
            <textarea
              id="finishingRemarks"
              name="finishingRemarks"
              rows={3}
              value={formData.finishingRemarks}
              onChange={handleChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                errors.finishingRemarks ? "ring-red-500" : "ring-gray-300"
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
              placeholder="Any additional finishing instructions..."
            />
          </div>
          {errors.finishingRemarks && (
            <p className="mt-2 text-sm text-red-600" id="finishingRemarks-error">
              {errors.finishingRemarks}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 
"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";

export type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRates: Record<string, number>;
  setExchangeRates: (rates: Record<string, number>) => void;
  formatCurrency: (amount: number) => string;
  convertCurrency: (amount: number, fromCurrency?: string) => number;
};

const defaultExchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.35,
  AUD: 1.52,
  JPY: 145.23,
  INR: 83.12,
  LKR: 320.5
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  exchangeRates: defaultExchangeRates,
  setExchangeRates: () => {},
  formatCurrency: () => "",
  convertCurrency: () => 0,
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<string>("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(defaultExchangeRates);

  // Load saved currency and exchange rates from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    const savedRates = localStorage.getItem("exchangeRates");
    
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    
    if (savedRates) {
      try {
        setExchangeRates(JSON.parse(savedRates));
      } catch (error) {
        console.error("Failed to parse saved exchange rates:", error);
      }
    }
  }, []);

  // Save currency and exchange rates to localStorage when they change
  useEffect(() => {
    localStorage.setItem("currency", currency);
    localStorage.setItem("exchangeRates", JSON.stringify(exchangeRates));
  }, [currency, exchangeRates]);

  // Format a number to the current currency with proper symbol
  const formatCurrency = (amount: number): string => {
    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
      AUD: "A$",
      JPY: "¥",
      INR: "₹",
      LKR: "Rs."
    };

    // Convert from USD to the selected currency
    const convertedAmount = convertCurrency(amount);
    const symbol = currencySymbols[currency] || currency;
    
    // Format based on currency
    if (currency === "JPY") {
      // JPY typically doesn't use decimal places
      return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
    } else {
      return `${symbol}${convertedAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  };

  // Convert an amount from USD to the current currency or between specified currencies
  const convertCurrency = (amount: number, fromCurrency = "USD"): number => {
    if (fromCurrency === currency) return amount;
    
    // Convert to USD first (if not already in USD)
    const amountInUSD = fromCurrency === "USD" 
      ? amount 
      : amount / exchangeRates[fromCurrency];
    
    // Then convert from USD to target currency
    return amountInUSD * exchangeRates[currency];
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        setCurrency, 
        exchangeRates, 
        setExchangeRates,
        formatCurrency,
        convertCurrency
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

export default CurrencyContext; 
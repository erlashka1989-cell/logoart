import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  ConstructorState,
  WizardStep
} from "@/types/constructor";

const INITIAL_STATE = {
  audience: ["employees"] as ConstructorState["audience"],
  quantity: 50,
  budgetPerPerson: 25000,
  industry: "it" as ConstructorState["industry"],
  brandColor: "black" as ConstructorState["brandColor"],
  psychology: ["practical"] as ConstructorState["psychology"],
  deadline: "two-three-weeks" as ConstructorState["deadline"],
  format: "one-time" as ConstructorState["format"],
  priority: "balance" as ConstructorState["priority"]
};

export const useConstructorStore = create<ConstructorState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      currentStep: 1,
      result: null,
      isGenerating: false,

      setAudience: (value) =>
        set({ audience: value }),

      setQuantity: (value) =>
        set({
          quantity: Math.min(
            10000,
            Math.max(1, Math.round(value))
          )
        }),

      setBudgetPerPerson: (value) =>
        set({
          budgetPerPerson: Math.min(
            1000000,
            Math.max(5000, Math.round(value))
          )
        }),

      setIndustry: (value) =>
        set({ industry: value }),

      setBrandColor: (value) =>
        set({ brandColor: value }),

      setPsychology: (value) =>
        set({ psychology: value }),

      setDeadline: (value) =>
        set({ deadline: value }),

      setFormat: (value) =>
        set({ format: value }),

      setPriority: (value) =>
        set({ priority: value }),

      nextStep: () =>
        set((state) => ({
          currentStep:
            state.currentStep < 6
              ? ((state.currentStep + 1) as WizardStep)
              : state.currentStep
        })),

      previousStep: () =>
        set((state) => ({
          currentStep:
            state.currentStep > 1
              ? ((state.currentStep - 1) as WizardStep)
              : state.currentStep
        })),

      setStep: (step) =>
        set({
          currentStep: step
        }),

      setResult: (result) =>
        set({
          result
        }),

      setIsGenerating: (value) =>
        set({
          isGenerating: value
        }),

      reset: () =>
        set({
          ...INITIAL_STATE,
          currentStep: 1,
          result: null,
          isGenerating: false
        })
    }),
    {
      name: "logoart-constructor"
    }
  )
);
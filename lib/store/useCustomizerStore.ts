import { create } from 'zustand';
import { ProductVariant } from '../data/mockCatalog';

export type ElementType = 'image' | 'text';

export interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  content: string; // URL for image, string for text
  color?: string;
  font?: string;
  side: 'front' | 'back';
  warning?: boolean; // E.g., outside print area, low res
}

interface CustomizerState {
  elements: DesignElement[];
  activeSide: 'front' | 'back';
  activeVariant: ProductVariant | null;
  history: DesignElement[][];
  historyIndex: number;
  is3DMode: boolean;
  
  // Actions
  addElement: (el: Omit<DesignElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
  setActiveSide: (side: 'front' | 'back') => void;
  setActiveVariant: (variant: ProductVariant) => void;
  set3DMode: (is3D: boolean) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  loadDesign: (elements: DesignElement[]) => void;
}

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
  elements: [],
  activeSide: 'front',
  activeVariant: null,
  history: [[]],
  historyIndex: 0,
  is3DMode: false,

  addElement: (el) => set((state) => {
    const newElement = { ...el, id: Math.random().toString(36).substring(2, 9) };
    const newElements = [...state.elements, newElement];
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    return {
      elements: newElements,
      history: [...newHistory, newElements],
      historyIndex: state.historyIndex + 1
    };
  }),

  updateElement: (id, updates) => set((state) => {
    const newElements = state.elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    return {
      elements: newElements,
      history: [...newHistory, newElements],
      historyIndex: state.historyIndex + 1
    };
  }),

  removeElement: (id) => set((state) => {
    const newElements = state.elements.filter(el => el.id !== id);
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    return {
      elements: newElements,
      history: [...newHistory, newElements],
      historyIndex: state.historyIndex + 1
    };
  }),

  setActiveSide: (side) => set({ activeSide: side }),
  
  setActiveVariant: (variant) => set({ activeVariant: variant }),

  set3DMode: (is3D) => set({ is3DMode: is3D }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      return {
        elements: state.history[state.historyIndex - 1],
        historyIndex: state.historyIndex - 1
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      return {
        elements: state.history[state.historyIndex + 1],
        historyIndex: state.historyIndex + 1
      };
    }
    return state;
  }),

  reset: () => set({
    elements: [],
    history: [[]],
    historyIndex: 0
  }),

  loadDesign: (elements) => set({
    elements,
    history: [elements],
    historyIndex: 0
  })
}));

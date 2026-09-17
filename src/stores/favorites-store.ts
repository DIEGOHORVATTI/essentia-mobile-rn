import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

import type { Patient } from '@/features/patients/mappers'

import { parsePatients } from './favorites-parse'

const STORAGE_KEY = 'favoritePatients'

type FavoritesStore = {
  patients: Patient[]
  hydrated: boolean
  hydrate: () => Promise<void>
  toggle: (patient: Patient) => void
  isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  patients: [],
  hydrated: false,
  hydrate: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null)
    set({ patients: parsePatients(raw), hydrated: true })
  },
  toggle: (patient) => {
    const current = get().patients
    const patients = current.some((item) => item.id === patient.id)
      ? current.filter((item) => item.id !== patient.id)
      : [patient, ...current]

    set({ patients })
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(patients)).catch(() => null)
  },
  isFavorite: (id) => get().patients.some((item) => item.id === id),
}))

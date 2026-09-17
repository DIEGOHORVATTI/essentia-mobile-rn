import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { MapPin, X } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { useThemeColors } from '@/theme'

import { searchCities } from '../cities'

type CityAutocompleteProps = {
  value?: string
  onChange: (city: string | undefined) => void
}

export function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
  const colors = useThemeColors()
  const suggestions = searchCities(value ?? '')

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase text-text-secondary">Cidade</Text>

      <View
        className="flex-row items-center gap-2 rounded-xl border border-border bg-bg-card px-3"
        style={{ height: 46 }}
      >
        <MapPin size={16} color={colors.textMuted} />
        <BottomSheetTextInput
          value={value ?? ''}
          onChangeText={(text) => onChange(text)}
          placeholder="Ex.: Boston"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          autoCorrect={false}
          style={{ flex: 1, color: colors.text, fontSize: 15, paddingVertical: 0 }}
        />
        {value ? (
          <Pressable
            hitSlop={8}
            onPress={() => onChange(undefined)}
            accessibilityLabel="Limpar cidade"
          >
            <X size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {suggestions.length > 0 ? (
        <View className="overflow-hidden rounded-xl border border-border bg-bg-card">
          {suggestions.map((city, index) => (
            <Pressable
              key={city}
              onPress={() => onChange(city)}
              className={`px-3 py-3 active:opacity-70 ${
                index < suggestions.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <Text className="text-base text-text-primary">{city}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  )
}

import { Search, X } from 'lucide-react-native'
import { Pressable, TextInput, View } from 'react-native'

import { useThemeColors } from '@/theme'

type SearchBarProps = {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar paciente por nome',
}: SearchBarProps) {
  const colors = useThemeColors()

  return (
    <View className="h-12 flex-row items-center gap-2 rounded-xl border border-border bg-bg-card px-3">
      <Search size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        className="flex-1 p-0 text-base text-text-primary"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable hitSlop={8} onPress={() => onChangeText('')} accessibilityLabel="Limpar busca">
          <X size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  )
}

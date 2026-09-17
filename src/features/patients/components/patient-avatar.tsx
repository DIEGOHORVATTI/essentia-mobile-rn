import { Image } from 'expo-image'
import { Text, View } from 'react-native'

type PatientAvatarProps = {
  uri: string
  initials: string
  size?: number
}

export function PatientAvatar({ uri, initials, size = 52 }: PatientAvatarProps) {
  return (
    <View
      className="items-center justify-center overflow-hidden rounded-full bg-primary-soft"
      style={{ width: size, height: size }}
    >
      <Text className="text-sm font-semibold text-primary">{initials}</Text>
      <Image
        source={{ uri }}
        style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
    </View>
  )
}

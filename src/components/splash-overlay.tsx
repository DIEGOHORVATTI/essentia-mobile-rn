import { LinearGradient } from 'expo-linear-gradient'
import { Text } from 'react-native'
import Animated from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

import { useSplashAnimation } from '@/hooks/use-splash-animation'

type SplashOverlayProps = {
  onFinish: () => void
}

const E_PATH = 'M350 152 H160 V360 H350 M160 256 H322'
const FILL = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const

export function SplashOverlay({ onFinish }: SplashOverlayProps) {
  const { containerStyle, logoStyle, textStyle } = useSplashAnimation(onFinish)

  return (
    <Animated.View
      className="absolute inset-0 z-10 items-center justify-center gap-4"
      style={containerStyle}
    >
      <LinearGradient
        colors={['#c4ad72', '#8f7d4e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={FILL}
      />
      <Animated.View
        className="h-32 w-32 items-center justify-center rounded-3xl bg-white/15"
        style={logoStyle}
      >
        <Svg width={84} height={84} viewBox="0 0 512 512">
          <Path
            d={E_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={30}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
      <Animated.View className="items-center gap-1" style={textStyle}>
        <Text className="text-[28px] font-bold text-white">Essentia Saude</Text>
        <Text className="text-[15px] text-white/85">Gestao clinica · pacientes</Text>
      </Animated.View>
    </Animated.View>
  )
}

import type { BottomSheetModal } from '@gorhom/bottom-sheet'

import {
  Cake,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  VenusAndMars,
  type LucideIcon,
} from 'lucide-react-native'
import { type ReactNode, useRef, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

import { formatDate, formatPhone } from '@/lib/format'
import { track } from '@/lib/analytics'
import { useThemeColors } from '@/theme'
import { useFavoritesStore } from '@/stores/favorites-store'
import { StateIcons, StateView } from '@/components/ui/state-view'

import { usePatient } from '../hooks/use-patient'
import { usePatientConditions } from '../hooks/use-patient-conditions'
import type { Condition } from '../mappers'
import { PatientAvatar } from './patient-avatar'
import { ConditionSheet } from './condition-sheet'
import { PatientDetailSkeleton } from './patient-detail-skeleton'

export function PatientDetail({ id }: { id: string }) {
  const colors = useThemeColors()
  const patientQuery = usePatient(id)
  const conditionsQuery = usePatientConditions(id)

  const toggle = useFavoritesStore((state) => state.toggle)
  const isFavorite = useFavoritesStore((state) => state.patients.some((item) => item.id === id))

  const conditionRef = useRef<BottomSheetModal>(null)
  const [selected, setSelected] = useState<Condition | null>(null)

  const openCondition = (condition: Condition) => {
    setSelected(condition)
    conditionRef.current?.present()
  }

  if (patientQuery.isLoading) return <PatientDetailSkeleton />

  if (patientQuery.isError || !patientQuery.data) {
    return (
      <StateView
        icon={StateIcons.TriangleAlert}
        title="Paciente indisponivel"
        message="Nao foi possivel carregar os dados deste paciente."
        actionLabel="Tentar de novo"
        onAction={() => patientQuery.refetch()}
      />
    )
  }

  const patient = patientQuery.data
  const info: { icon: LucideIcon; label: string; value?: string }[] = [
    { icon: VenusAndMars, label: 'Sexo', value: patient.genderLabel },
    {
      icon: Cake,
      label: 'Nascimento',
      value: [formatDate(patient.birthDate), patient.age != null ? `${patient.age} anos` : null]
        .filter(Boolean)
        .join(' · '),
    },
    { icon: MapPin, label: 'Localizacao', value: patient.location },
    { icon: Phone, label: 'Telefone', value: formatPhone(patient.phone) },
    { icon: Mail, label: 'E-mail', value: patient.email },
  ]

  return (
    <>
      <ScrollView contentContainerClassName="gap-6 p-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-4">
          <PatientAvatar uri={patient.avatarUrl} initials={patient.initials} size={72} />
          <View className="flex-1 gap-1">
            <Text className="text-xl font-semibold text-text-primary">{patient.fullName}</Text>
            <StatusBadge active={patient.active} />
          </View>
          <Pressable
            onPress={() => {
              toggle(patient)
              track({ name: 'patient_favorite_toggle', id: patient.id, favorited: !isFavorite })
            }}
            hitSlop={8}
            className="p-1"
            accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart
              size={24}
              color={isFavorite ? colors.danger : colors.textMuted}
              fill={isFavorite ? colors.danger : 'transparent'}
            />
          </Pressable>
        </View>

        <Section title="Dados do paciente">
          <View className="rounded-2xl border border-border bg-bg-secondary px-4">
            {info
              .filter((item) => item.value && item.value.length > 0)
              .map((item, index, list) => (
                <InfoRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  divider={index < list.length - 1}
                />
              ))}
          </View>
        </Section>

        <Section title="Condicoes clinicas">
          <ConditionsBlock
            isLoading={conditionsQuery.isLoading}
            isError={conditionsQuery.isError}
            conditions={conditionsQuery.data ?? []}
            onSelect={openCondition}
          />
        </Section>
      </ScrollView>

      <ConditionSheet ref={conditionRef} condition={selected} />
    </>
  )
}

function ConditionsBlock({
  isLoading,
  isError,
  conditions,
  onSelect,
}: {
  isLoading: boolean
  isError: boolean
  conditions: Condition[]
  onSelect: (condition: Condition) => void
}) {
  const colors = useThemeColors()

  if (isLoading) return <Text className="text-base text-text-muted">Carregando condicoes...</Text>
  if (isError)
    return (
      <Text className="text-base text-text-muted">Nao foi possivel carregar as condicoes.</Text>
    )
  if (conditions.length === 0)
    return <Text className="text-base text-text-muted">Nenhuma condicao registrada.</Text>

  return (
    <View className="rounded-2xl border border-border bg-bg-secondary px-4">
      {conditions.map((condition, index) => (
        <Pressable
          key={condition.id}
          onPress={() => onSelect(condition)}
          className={`flex-row items-center gap-3 py-3 active:opacity-70 ${
            index < conditions.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary-soft">
            <Stethoscope size={16} color={colors.primary} />
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-base text-text-primary" numberOfLines={1}>
              {condition.label}
            </Text>
            {condition.date ? (
              <Text className="text-xs text-text-muted">
                Registrado em {formatDate(condition.date)}
              </Text>
            ) : null}
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </Pressable>
      ))}
    </View>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        {title}
      </Text>
      {children}
    </View>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  divider,
}: {
  icon: LucideIcon
  label: string
  value?: string
  divider: boolean
}) {
  const colors = useThemeColors()
  return (
    <View className={`flex-row items-center gap-3 py-3 ${divider ? 'border-b border-border' : ''}`}>
      <Icon size={18} color={colors.textMuted} />
      <Text className="w-24 text-base text-text-secondary">{label}</Text>
      <Text className="flex-1 text-right text-base text-text-primary" numberOfLines={1}>
        {value}
      </Text>
    </View>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <View
      className={`self-start rounded-full px-3 py-1 ${active ? 'bg-success/15' : 'bg-bg-card'}`}
    >
      <Text className={`text-xs font-semibold ${active ? 'text-success' : 'text-text-muted'}`}>
        {active ? 'Ativo' : 'Inativo'}
      </Text>
    </View>
  )
}

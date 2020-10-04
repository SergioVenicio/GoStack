import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { format } from "date-fns";

import Icon from "react-native-vector-icons/Feather";

import DateTimePicker from "@react-native-community/datetimepicker";

import useAuthContext from "../../contexts/AuthContext";

import {
  Container,
  Content,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from "./styles";
import api from "../../services/api";

interface RouteParams {
  providerId: string;
}

interface IAvailabilityItem {
  hour: number;
  available: boolean;
}

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { user } = useAuthContext();

  const routeParams = route.params as RouteParams;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  const [availability, setAvailability] = useState<IAvailabilityItem[]>([]);
  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), "HH:00"),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), "HH:00"),
        };
      });
  }, [availability]);

  const [providers, setProviders] = useState<IProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId
  );

  const { goBack, navigate } = useNavigation();

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleToogleDatePicker = useCallback(() => {
    setShowDatePicker((oldState) => !oldState);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    date && setSelectedDate(date);
  }, []);

  const handleSelectProvider = useCallback(
    (providerId: string) => {
      setSelectedProvider(providerId);
    },
    [setSelectedProvider]
  );

  const handleSelectHour = useCallback(
    (hour: number) => {
      setSelectedHour(hour);
    },
    [setSelectedHour]
  );

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post(`/appointments`, {
        provider_id: selectedProvider,
        date,
      });

      navigate("AppointmentCreated", { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        "Erro ao criar agendamento",
        "Ocorreu um erro ao criar agendamento, tente novamente"
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  useEffect(() => {
    api.get("/providers").then(({ data }) => {
      setProviders(data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(({ data }) => {
        setAvailability(data);
      });
  }, [selectedDate, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleleiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(provider) => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToogleDatePicker}>
            <OpenDatePickerButtonText>Selecionar data</OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              value={selectedDate}
              onChange={handleDateChange}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability &&
                morningAvailability.map(
                  ({ hour, hourFormatted, available }) => (
                    <Hour
                      enabled={available}
                      selected={hour === selectedHour}
                      key={hourFormatted}
                      available={available}
                      onPress={() => handleSelectHour(hour)}
                    >
                      <HourText selected={hour === selectedHour}>
                        {hourFormatted}
                      </HourText>
                    </Hour>
                  )
                )}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability &&
                afternoonAvailability.map(
                  ({ hour, hourFormatted, available }) => (
                    <Hour
                      enabled={available}
                      selected={hour === selectedHour}
                      key={hourFormatted}
                      available={available}
                      onPress={() => available && handleSelectHour(hour)}
                    >
                      <HourText selected={hour === selectedHour}>
                        {hourFormatted}
                      </HourText>
                    </Hour>
                  )
                )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;

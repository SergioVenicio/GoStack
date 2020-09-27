import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DayPicker, { DayModifiers } from "react-day-picker";
import "react-day-picker/lib/style.css";

import { isToday, format, parseISO, isAfter } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import {
  Calendar,
  Container,
  Content,
  Header,
  HeaderContent,
  Profile,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
} from "./styles";

import logo from "../../assets/logo.svg";
import { FiClock, FiPower } from "react-icons/fi";
import useAuthContext from "../../contexts/AuthContext";
import api from "../../services/api";

interface MonthAvailabityItem {
  day: number;
  available: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuthContext();
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailabity, setMonthAvailabity] = useState<MonthAvailabityItem[]>(
    []
  );

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, "cccc", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const nextAppointment = useMemo(() => {
    const filterDate = new Date();
    return appointments.find((appointment) => {
      isAfter(parseISO(appointment.date), filterDate);
    });
  }, [appointments]);

  const morningAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const disableDays = useMemo(() => {
    const dates = monthAvailabity
      .filter(({ available }) => !available)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailabity]);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(({ data }) => {
        setMonthAvailabity(data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<IAppointment[]>("appointments/me", {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(({ data }) => {
        const appoitmentsFormatted = data.map((appointment) => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), "HH:mm"),
          };
        });
        setAppointments(appoitmentsFormatted);
      });
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logo} alt="Gobarber logo" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem-vindo</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) ? <span>Hoje</span> : null}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment ? (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment?.user.avatar_url}
                  alt={nextAppointment?.user.avatar_url}
                />

                <strong>{nextAppointment?.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment?.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          ) : null}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 ? (
              <p>Nenhum agendamento no horário da manhã</p>
            ) : (
              morningAppointments.map((appointment) => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>

                  <div>
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))
            )}
          </Section>
          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 ? (
              <p>Nenhum agendamento no horário da tarde</p>
            ) : (
              afternoonAppointments.map((appointment) => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>

                  <div>
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))
            )}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={["D", "S", "T", "Q", "Q", "S", "S"]}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;

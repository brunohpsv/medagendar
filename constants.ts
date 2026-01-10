
import { Doctor, WorkConfig } from './types';

const defaultWorkConfig: WorkConfig = {
  daysOfWeek: [1, 2, 3, 4, 5],
  startTime: '08:00',
  endTime: '18:00',
  slotDuration: 30,
  breaks: {
    lunch: { start: '12:00', end: '13:30', active: true },
    dinner: { start: '19:00', end: '20:00', active: false }
  }
};

const generateSchedule = () => [
  { date: '2024-10-28', label: 'Seg, 28 Out', slots: ['08:00', '08:30', '09:00', '10:30', '14:00', '16:00'] },
  { date: '2024-10-29', label: 'Ter, 29 Out', slots: ['09:30', '11:00', '13:00', '15:30'] },
  { date: '2024-10-30', label: 'Qua, 30 Out', slots: ['08:30', '10:00', '14:30', '17:00'] },
  { date: '2024-10-31', label: 'Qui, 31 Out', slots: ['10:30', '12:00', '15:00', '16:30'] },
  { date: '2024-11-01', label: 'Sex, 01 Nov', slots: ['09:00', '11:30', '14:00'] },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dra. Beatriz Menezes',
    specialties: ['Dermatologia', 'Estética'],
    rating: 4.9,
    reviews: 156,
    location: 'Jardins, São Paulo',
    clinicAddress: 'Av. Paulista, 1000 - Conjunto 52',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: 'Especialista em estética facial.',
    fullBio: 'Dra. Beatriz é referência em dermatologia clínica e estética, com mestrado pela USP.',
    price: 450,
    priceType: 'fixed',
    acceptsOnline: true,
    education: ['Graduação em Medicina - USP', 'Residência Médica - HC-FMUSP'],
    schedule: generateSchedule(),
    workConfig: defaultWorkConfig
  },
  {
    id: '2',
    name: 'Dr. Lucas Viana',
    specialties: ['Ortopedia', 'Medicina Esportiva'],
    rating: 4.8,
    reviews: 92,
    location: 'Ipanema, Rio de Janeiro',
    clinicAddress: 'Rua Visconde de Pirajá, 500',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    bio: 'Cirurgião ortopedista focado em medicina esportiva.',
    fullBio: 'Com mais de 10 anos acompanhando atletas profissionais.',
    price: 380,
    priceType: 'clinic',
    acceptsOnline: false,
    education: ['Medicina - UFRJ', 'Especialização - UNIFESP'],
    schedule: generateSchedule(),
    workConfig: defaultWorkConfig
  }
];

export const SPECIALTIES = [
  'Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 'Ginecologia', 
  'Psiquiatria', 'Oftalmologia', 'Neurologia', 'Endocrinologia', 'Estética', 'Medicina Esportiva'
];

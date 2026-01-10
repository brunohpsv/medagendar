
import React, { useState, useEffect, useMemo } from 'react';
import { Doctor, Appointment, ViewState, DaySchedule, WorkConfig } from './types';
import { MOCK_DOCTORS, SPECIALTIES } from './constants';
import DoctorCard from './components/DoctorCard';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [dashTab, setDashTab] = useState<'overview' | 'config'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock de perfil editável para o painel profissional
  const [profProfile, setProfProfile] = useState<Doctor>(MOCK_DOCTORS[1]);

  useEffect(() => {
    const saved = localStorage.getItem('medagendar_appointments');
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter(doc => {
      const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchSpecialty = selectedSpecialty ? doc.specialties.includes(selectedSpecialty) : true;
      return matchSearch && matchSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  const openBooking = (doc: Doctor) => {
    setActiveDoctor(doc);
    setSelectedDay(doc.schedule[0]);
    setSelectedSlot(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmBooking = () => {
    if (!activeDoctor || !selectedDay || !selectedSlot) return;
    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      date: selectedDay.label,
      time: selectedSlot,
      patientName: 'Paciente Exemplo',
      status: 'confirmed'
    };
    setAppointments([newApp, ...appointments]);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveDoctor(null);
    }, 2000);
  };

  const updateWorkConfig = (field: string, value: any) => {
    setProfProfile(prev => ({
      ...prev,
      workConfig: { ...prev.workConfig, [field]: value }
    }));
  };

  const updateBreak = (type: 'lunch' | 'dinner', field: string, value: any) => {
    setProfProfile(prev => ({
      ...prev,
      workConfig: {
        ...prev.workConfig,
        breaks: {
          ...prev.workConfig.breaks,
          [type]: { ...prev.workConfig.breaks[type], [field]: value }
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Inter'] selection:bg-indigo-100">
      <header className="h-20 border-b border-slate-50 sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div onClick={() => { setView('home'); setActiveDoctor(null); }} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white transition-all group-hover:bg-indigo-600">
               <i className="fas fa-plus-square text-lg"></i>
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic">Med<span className="text-indigo-600 not-italic">Agendar</span></span>
          </div>

          <nav className="flex items-center gap-6 md:gap-10">
            <button onClick={() => setView('home')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Início</button>
            <button onClick={() => setView('professional_signup')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'professional_signup' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Cadastro Profissional</button>
            <button onClick={() => setView('professional_dashboard')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'professional_dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Painel Profissional</button>
            <button onClick={() => setView('admin_dashboard')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'admin_dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Painel ADM</button>
          </nav>
        </div>
      </header>

      <main>
        {isSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-[100] animate-in slide-in-from-top-4 flex items-center gap-3">
             <i className="fas fa-check-circle text-green-400"></i> Agendamento confirmado!
          </div>
        )}

        {view === 'home' && (
           <div className="animate-in fade-in duration-500">
           {activeDoctor ? (
             <div className="max-w-5xl mx-auto px-6 py-12">
                <button onClick={() => setActiveDoctor(null)} className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] mb-8 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                   <i className="fas fa-arrow-left"></i> Voltar aos especialistas
                </button>
                
                <div className="grid lg:grid-cols-12 gap-10">
                   <div className="lg:col-span-12 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-50 pb-10">
                      <img src={activeDoctor.image} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-[32px] shadow-xl border-4 border-white" />
                      <div className="flex-1 text-center md:text-left">
                         <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
                           <h2 className="text-4xl font-black tracking-tighter leading-none">{activeDoctor.name}</h2>
                           <div className="flex flex-wrap justify-center md:justify-start gap-2">
                             {activeDoctor.specialties.map(s => (
                               <span key={s} className="text-indigo-600 font-bold text-[9px] uppercase tracking-[0.2em] bg-indigo-50 px-2 py-1 rounded-md">{s}</span>
                             ))}
                           </div>
                         </div>
                         <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-slate-400 font-medium mb-6">
                           <span className="flex items-center gap-1.5"><i className="fas fa-star text-amber-400"></i> <b className="text-slate-900">{activeDoctor.rating}</b> ({activeDoctor.reviews} reviews)</span>
                           <span className="flex items-center gap-1.5"><i className="fas fa-map-marker-alt"></i> {activeDoctor.location}</span>
                         </div>
                         <p className="text-sm leading-relaxed text-slate-500 max-w-2xl font-light">{activeDoctor.fullBio}</p>
                         <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 inline-block text-[11px] text-slate-500">
                            <i className="fas fa-hospital mr-2 text-indigo-400"></i> <b>Endereço Clínica:</b> {activeDoctor.clinicAddress}
                         </div>
                      </div>
                   </div>

                   <div className="lg:col-span-8">
                      <div className="bg-white rounded-[40px] border border-slate-50 p-8">
                         <h3 className="text-lg font-bold mb-8 tracking-tight flex items-center gap-2">
                           <i className="far fa-calendar-check text-indigo-600"></i>
                           Escolha um horário
                         </h3>
                         <div className="mb-10 overflow-x-auto flex gap-2.5 pb-2 minimal-scroll">
                            {activeDoctor.schedule.map(day => (
                              <button key={day.date} onClick={() => { setSelectedDay(day); setSelectedSlot(null); }} className={`flex-shrink-0 px-6 py-4 rounded-2xl border transition-all text-center min-w-[110px] ${selectedDay?.date === day.date ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}>
                                 <span className="block text-[9px] font-bold uppercase opacity-60 mb-1">{day.label.split(',')[0]}</span>
                                 <span className="text-sm font-black">{day.label.split(',')[1]}</span>
                              </button>
                            ))}
                         </div>
                         <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mb-8">
                            {selectedDay?.slots.map(slot => (
                              <button key={slot} onClick={() => setSelectedSlot(slot)} className={`py-3.5 rounded-xl border text-xs font-bold transition-all ${selectedSlot === slot ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-transparent text-slate-300 hover:text-slate-600 hover:border-slate-100'}`}>{slot}</button>
                            ))}
                         </div>
                         <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-6 bg-slate-50 rounded-3xl">
                            <div>
                               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">
                                 {activeDoctor.priceType === 'fixed' ? 'Valor Fixo' : activeDoctor.priceType === 'clinic' ? 'No Local' : 'A Combinar'}
                               </span>
                               <span className="text-2xl font-black">{activeDoctor.priceType === 'combined' ? 'A Combinar' : `R$ ${activeDoctor.price}`}</span>
                            </div>
                            <button disabled={!selectedSlot} onClick={confirmBooking} className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 disabled:opacity-20">Agendar agora</button>
                         </div>
                      </div>
                   </div>
                   <div className="lg:col-span-4 space-y-6">
                      <div className="bg-slate-50 p-8 rounded-[40px]">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Formação e Expertise</h4>
                         <ul className="space-y-4">
                            {activeDoctor.education.map((edu, i) => (
                               <li key={i} className="flex gap-3 text-xs text-slate-500 leading-relaxed">
                                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] text-indigo-400 border border-slate-100 flex-shrink-0"><i className="fas fa-check"></i></div>
                                  {edu}
                               </li>
                            ))}
                         </ul>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <>
               <div className="py-20 px-6">
                 <div className="max-w-4xl mx-auto text-center">
                   <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">Sua saúde, <br/><span className="text-indigo-600">simplificada.</span></h1>
                   <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto bg-slate-50 p-2 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-100">
                     <input type="text" placeholder="Procure por especialidade ou nome..." className="flex-1 px-8 py-5 outline-none text-slate-800 bg-transparent font-medium text-lg placeholder:text-slate-300" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                     <button className="bg-indigo-600 text-white px-12 py-5 rounded-[32px] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all">Buscar</button>
                   </div>
                 </div>
               </div>
               <div className="max-w-4xl mx-auto px-6 mb-20">
                 <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Profissionais Disponíveis</h2>
                   <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none text-slate-400 cursor-pointer">
                     <option value="">Todas Especialidades</option>
                     {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
                 <div className="space-y-6">
                   {filteredDoctors.map(doc => <DoctorCard key={doc.id} doctor={doc} onClick={openBooking} />)}
                 </div>
               </div>
             </>
           )}
         </div>
        )}

        {/* PAINEL PROFISSIONAL REFORMULADO */}
        {view === 'professional_dashboard' && (
          <div className="max-w-6xl mx-auto px-6 py-16 animate-in fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                   <h2 className="text-5xl font-black tracking-tighter mb-2">Painel <span className="text-indigo-600">Médico.</span></h2>
                   <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.4em]">Dr. {profProfile.name}</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                   <button onClick={() => setDashTab('overview')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dashTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Visão Geral</button>
                   <button onClick={() => setDashTab('config')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dashTab === 'config' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Configurações da Clínica</button>
                </div>
             </div>

             {dashTab === 'overview' ? (
                <div className="animate-in fade-in">
                   <div className="grid md:grid-cols-4 gap-6 mb-12">
                      <div className="p-8 bg-indigo-600 rounded-[40px] text-white shadow-xl shadow-indigo-100">
                         <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-2">Consultas Hoje</p>
                         <h4 className="text-4xl font-black">04</h4>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[40px]">
                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Agendamentos Mês</p>
                         <h4 className="text-4xl font-black text-slate-900">128</h4>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[40px]">
                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Faturamento Est.</p>
                         <h4 className="text-4xl font-black text-slate-900">R$ 15k</h4>
                      </div>
                      <div className="p-8 bg-slate-900 rounded-[40px] text-white">
                         <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">Satisfação</p>
                         <h4 className="text-4xl font-black">4.9</h4>
                      </div>
                   </div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-8">Agenda Próxima</h3>
                   <div className="space-y-4">
                      {appointments.length > 0 ? appointments.map(app => (
                        <div key={app.id} className="bg-white p-6 rounded-[32px] border border-slate-50 flex flex-col sm:flex-row justify-between items-center group hover:shadow-lg transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all"><i className="far fa-user"></i></div>
                              <div>
                                 <h4 className="font-bold tracking-tight text-slate-900">{app.patientName}</h4>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{app.time} • Presencial</p>
                              </div>
                           </div>
                           <button className="px-5 py-2.5 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">Ver Prontuário</button>
                        </div>
                      )) : <div className="py-20 text-center text-slate-200 uppercase font-black text-xs tracking-widest">Nenhuma consulta hoje</div>}
                   </div>
                </div>
             ) : (
                <div className="grid lg:grid-cols-2 gap-10 animate-in fade-in">
                   {/* Coluna 1: Dados do Perfil e Clínica */}
                   <div className="space-y-8">
                      <div className="bg-slate-50 p-8 rounded-[48px] border border-slate-100">
                         <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-indigo-600 flex items-center gap-3">
                            <i className="fas fa-id-card"></i> Identidade e Localização
                         </h3>
                         <div className="space-y-6">
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-300 block mb-2 ml-1">Especialidades (Adicionar)</label>
                               <div className="flex flex-wrap gap-2 mb-3">
                                  {profProfile.specialties.map(s => (
                                    <span key={s} className="bg-white px-3 py-1.5 rounded-xl text-[10px] font-bold text-indigo-600 border border-indigo-100 flex items-center gap-2 shadow-sm">
                                       {s} <i className="fas fa-times cursor-pointer hover:text-red-500" onClick={() => setProfProfile(p => ({...p, specialties: p.specialties.filter(x => x !== s)}))}></i>
                                    </span>
                                  ))}
                               </div>
                               <select 
                                 onChange={(e) => {
                                   if(e.target.value && !profProfile.specialties.includes(e.target.value)) {
                                     setProfProfile(p => ({...p, specialties: [...p.specialties, e.target.value]}));
                                   }
                                 }}
                                 className="w-full p-4 bg-white rounded-2xl border-none outline-none text-xs font-bold text-slate-500 shadow-sm"
                               >
                                  <option value="">+ Adicionar especialidade</option>
                                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                               </select>
                            </div>
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-300 block mb-2 ml-1">Endereço da Clínica</label>
                               <input 
                                 type="text" 
                                 value={profProfile.clinicAddress}
                                 onChange={(e) => setProfProfile(p => ({...p, clinicAddress: e.target.value}))}
                                 className="w-full p-4 bg-white rounded-2xl border-none outline-none text-xs font-bold text-slate-700 shadow-sm"
                                 placeholder="Rua, Número, Complemento..."
                               />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                               <div>
                                  <p className="text-[10px] font-black uppercase text-slate-900 leading-none">Atendimento Online</p>
                                  <p className="text-[9px] text-slate-400 mt-1 uppercase">Aceita vídeo-consultas?</p>
                               </div>
                               <button 
                                 onClick={() => setProfProfile(p => ({...p, acceptsOnline: !p.acceptsOnline}))}
                                 className={`w-12 h-6 rounded-full transition-all relative ${profProfile.acceptsOnline ? 'bg-green-500' : 'bg-slate-200'}`}
                               >
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profProfile.acceptsOnline ? 'right-1' : 'left-1'}`}></div>
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[48px] border border-slate-100">
                         <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-indigo-600 flex items-center gap-3">
                            <i className="fas fa-coins"></i> Política de Preços
                         </h3>
                         <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-2">
                               {(['fixed', 'combined', 'clinic'] as const).map(type => (
                                 <button 
                                   key={type}
                                   onClick={() => setProfProfile(p => ({...p, priceType: type}))}
                                   className={`p-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${profProfile.priceType === type ? 'bg-slate-900 text-white' : 'bg-white text-slate-300'}`}
                                 >
                                    {type === 'fixed' ? 'Fixo' : type === 'combined' ? 'A Combinar' : 'No Local'}
                                 </button>
                               ))}
                            </div>
                            {profProfile.priceType === 'fixed' && (
                               <div>
                                  <label className="text-[9px] font-black uppercase text-slate-300 block mb-2 ml-1">Valor da Consulta (R$)</label>
                                  <input 
                                    type="number" 
                                    value={profProfile.price}
                                    onChange={(e) => setProfProfile(p => ({...p, price: Number(e.target.value)}))}
                                    className="w-full p-4 bg-white rounded-2xl border-none outline-none text-lg font-black text-slate-900 shadow-sm"
                                  />
                               </div>
                            )}
                         </div>
                      </div>
                   </div>

                   {/* Coluna 2: Configuração de Agenda e Horários */}
                   <div className="bg-slate-900 p-10 rounded-[56px] text-white">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-indigo-400 flex items-center gap-3">
                         <i className="fas fa-clock"></i> Gestão de Agenda
                      </h3>
                      <div className="space-y-10">
                         {/* Dias de trabalho */}
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Dias de Atendimento</p>
                            <div className="flex gap-2">
                               {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                 <button 
                                   key={i}
                                   onClick={() => {
                                     const days = profProfile.workConfig.daysOfWeek;
                                     const newDays = days.includes(i) ? days.filter(x => x !== i) : [...days, i];
                                     updateWorkConfig('daysOfWeek', newDays.sort());
                                   }}
                                   className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${profProfile.workConfig.daysOfWeek.includes(i) ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}
                                 >
                                    {d}
                                 </button>
                               ))}
                            </div>
                         </div>

                         {/* Horário Principal e Intervalo */}
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Início e Fim</label>
                               <div className="flex gap-2 items-center">
                                  <input type="time" value={profProfile.workConfig.startTime} onChange={(e) => updateWorkConfig('startTime', e.target.value)} className="bg-slate-800 p-3 rounded-xl border-none text-xs font-bold w-full outline-none focus:ring-1 focus:ring-indigo-500" />
                                  <span className="text-slate-600">/</span>
                                  <input type="time" value={profProfile.workConfig.endTime} onChange={(e) => updateWorkConfig('endTime', e.target.value)} className="bg-slate-800 p-3 rounded-xl border-none text-xs font-bold w-full outline-none focus:ring-1 focus:ring-indigo-500" />
                               </div>
                            </div>
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Duração (minutos)</label>
                               <select value={profProfile.workConfig.slotDuration} onChange={(e) => updateWorkConfig('slotDuration', Number(e.target.value))} className="bg-slate-800 p-3 rounded-xl border-none text-xs font-bold w-full outline-none">
                                  <option value={15}>15 min</option>
                                  <option value={30}>30 min</option>
                                  <option value={45}>45 min</option>
                                  <option value={60}>60 min</option>
                               </select>
                            </div>
                         </div>

                         {/* Pausas (Almoço / Jantar) */}
                         <div className="space-y-6 pt-6 border-t border-slate-800">
                            <div className="flex items-center justify-between">
                               <div>
                                  <p className="text-xs font-bold">Bloqueio para Almoço</p>
                                  {profProfile.workConfig.breaks.lunch.active && (
                                    <div className="flex gap-2 items-center mt-3">
                                       <input type="time" value={profProfile.workConfig.breaks.lunch.start} onChange={(e) => updateBreak('lunch', 'start', e.target.value)} className="bg-slate-800 p-2 rounded-lg border-none text-[10px] font-bold outline-none" />
                                       <span className="text-slate-600 text-[10px]">às</span>
                                       <input type="time" value={profProfile.workConfig.breaks.lunch.end} onChange={(e) => updateBreak('lunch', 'end', e.target.value)} className="bg-slate-800 p-2 rounded-lg border-none text-[10px] font-bold outline-none" />
                                    </div>
                                  )}
                               </div>
                               <button 
                                 onClick={() => updateBreak('lunch', 'active', !profProfile.workConfig.breaks.lunch.active)}
                                 className={`w-10 h-5 rounded-full relative transition-all ${profProfile.workConfig.breaks.lunch.active ? 'bg-indigo-600' : 'bg-slate-700'}`}
                               >
                                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${profProfile.workConfig.breaks.lunch.active ? 'right-0.5' : 'left-0.5'}`}></div>
                               </button>
                            </div>

                            <div className="flex items-center justify-between">
                               <div>
                                  <p className="text-xs font-bold">Bloqueio para Jantar</p>
                                  {profProfile.workConfig.breaks.dinner.active && (
                                    <div className="flex gap-2 items-center mt-3">
                                       <input type="time" value={profProfile.workConfig.breaks.dinner.start} onChange={(e) => updateBreak('dinner', 'start', e.target.value)} className="bg-slate-800 p-2 rounded-lg border-none text-[10px] font-bold outline-none" />
                                       <span className="text-slate-600 text-[10px]">às</span>
                                       <input type="time" value={profProfile.workConfig.breaks.dinner.end} onChange={(e) => updateBreak('dinner', 'end', e.target.value)} className="bg-slate-800 p-2 rounded-lg border-none text-[10px] font-bold outline-none" />
                                    </div>
                                  )}
                               </div>
                               <button 
                                 onClick={() => updateBreak('dinner', 'active', !profProfile.workConfig.breaks.dinner.active)}
                                 className={`w-10 h-5 rounded-full relative transition-all ${profProfile.workConfig.breaks.dinner.active ? 'bg-indigo-600' : 'bg-slate-700'}`}
                               >
                                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${profProfile.workConfig.breaks.dinner.active ? 'right-0.5' : 'left-0.5'}`}></div>
                               </button>
                            </div>
                         </div>

                         <button className="w-full py-5 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/10 hover:bg-indigo-50 transition-all">
                            Salvar Alterações da Agenda
                         </button>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {/* PAINEL ADMINISTRADOR */}
        {view === 'admin_dashboard' && (
          <div className="max-w-6xl mx-auto px-6 py-16 animate-in fade-in">
             <div className="mb-16">
                <h2 className="text-5xl font-black tracking-tighter mb-2">Painel <span className="text-indigo-600">ADM.</span></h2>
                <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.4em]">Gerenciamento Geral da Plataforma</p>
             </div>
             <div className="grid lg:grid-cols-4 gap-6 mb-16">
                <div className="p-10 border border-slate-100 rounded-[48px] bg-slate-50">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Profissionais</p>
                   <h4 className="text-5xl font-black text-slate-900">{MOCK_DOCTORS.length}</h4>
                   <p className="text-[10px] text-green-500 font-bold mt-4 uppercase">+2 esta semana</p>
                </div>
                <div className="p-10 border border-slate-100 rounded-[48px]">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Pacientes</p>
                   <h4 className="text-5xl font-black text-slate-900">1.2k</h4>
                </div>
                <div className="p-10 border border-slate-100 rounded-[48px]">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Agendamentos</p>
                   <h4 className="text-5xl font-black text-slate-900">8.4k</h4>
                </div>
                <div className="p-10 bg-slate-900 rounded-[48px] text-white">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Satisfação</p>
                   <h4 className="text-5xl font-black">98<span className="text-lg opacity-40">%</span></h4>
                </div>
             </div>
             <div className="bg-white p-10 rounded-[56px] border border-slate-50 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-lg font-black uppercase tracking-widest">Lista de Profissionais Ativos</h3>
                   <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest underline">Baixar Relatório CSV</button>
                </div>
                <div className="space-y-4">
                   {MOCK_DOCTORS.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl group">
                         <div className="flex items-center gap-6">
                            <img src={doc.image} className="w-12 h-12 rounded-2xl object-cover" />
                            <div>
                               <p className="font-bold text-slate-900">{doc.name}</p>
                               <div className="flex gap-1 mt-1">
                                  {doc.specialties.map(s => (
                                    <span key={s} className="text-[8px] text-slate-400 uppercase font-bold tracking-widest bg-white px-1.5 py-0.5 rounded border border-slate-100">{s}</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-4 items-center">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ID: #{doc.id}</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"><i className="fas fa-ban text-xs"></i></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* CADASTRO DO PROFISSIONAL */}
        {view === 'professional_signup' && (
          <div className="max-w-2xl mx-auto px-6 py-20 animate-in fade-in">
             <h2 className="text-5xl font-black tracking-tighter mb-6">Junte-se à <span className="text-indigo-600">Elite.</span></h2>
             <p className="text-slate-400 font-light mb-12 text-lg">Cadastre seu consultório e comece a receber agendamentos inteligentes hoje mesmo.</p>
             <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nome Completo" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                  <input type="text" placeholder="CRM / Registro" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <input type="text" placeholder="Especialidades (Separe por vírgula)" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                <input type="email" placeholder="E-mail Profissional" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                <input type="text" placeholder="Endereço da Clínica" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                <textarea placeholder="Breve biografia profissional..." className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100 h-32"></textarea>
                <button className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100">Solicitar Credenciamento</button>
             </div>
          </div>
        )}
      </main>

      <footer className="py-24 border-t border-slate-50 mt-auto">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="opacity-10 grayscale flex items-center gap-3">
               <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px]"><i className="fas fa-plus"></i></div>
               <span className="text-xs font-black uppercase tracking-tighter italic">MedAgendar</span>
            </div>
            <p className="text-[10px] font-black text-slate-100 uppercase tracking-[0.5em] text-center">EXCELLENCE IN DIGITAL HEALTHCARE — 2024</p>
            <div className="flex gap-8 text-slate-200">
               <i className="fab fa-instagram hover:text-indigo-600 cursor-pointer transition-colors"></i>
               <i className="fab fa-linkedin-in hover:text-indigo-600 cursor-pointer transition-colors"></i>
            </div>
         </div>
      </footer>

      <AIAssistant />
    </div>
  );
};

export default App;

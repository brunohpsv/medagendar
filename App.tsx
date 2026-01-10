
import React, { useState, useEffect, useMemo } from 'react';
import { Doctor, Appointment, ViewState, DaySchedule, WorkConfig } from './types';
import { MOCK_DOCTORS, SPECIALTIES } from './constants';
import DoctorCard from './components/DoctorCard';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  // Estados Principais
  const [view, setView] = useState<ViewState>('home');
  const [dashTab, setDashTab] = useState<'overview' | 'config'>('overview');
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Estados de Busca e Seleção
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Feedback Visual
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Simulação de Usuário Logado (Dr. Lucas Viana por padrão para o Painel)
  const [loggedInDoctorId] = useState('2');
  const profProfile = useMemo(() => 
    doctors.find(d => d.id === loggedInDoctorId) || doctors[0], 
    [doctors, loggedInDoctorId]
  );

  // Carregar e Salvar Dados
  useEffect(() => {
    const savedDocs = localStorage.getItem('medagendar_doctors');
    const savedApps = localStorage.getItem('medagendar_appointments');
    if (savedDocs) setDoctors(JSON.parse(savedDocs));
    if (savedApps) setAppointments(JSON.parse(savedApps));
  }, []);

  useEffect(() => {
    localStorage.setItem('medagendar_doctors', JSON.stringify(doctors));
    localStorage.setItem('medagendar_appointments', JSON.stringify(appointments));
  }, [doctors, appointments]);

  // Filtro de Médicos na Home
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchSpecialty = selectedSpecialty ? doc.specialties.includes(selectedSpecialty) : true;
      return matchSearch && matchSpecialty;
    });
  }, [searchQuery, selectedSpecialty, doctors]);

  // Ações de Agendamento
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
      patientName: 'Usuário Logado',
      status: 'confirmed'
    };
    setAppointments([newApp, ...appointments]);
    setSuccessMsg('Agendamento confirmado com sucesso!');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveDoctor(null);
      setView('home');
    }, 2000);
  };

  // Cadastro de Novo Profissional
  const handleProfessionalSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDoctor: Doctor = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      name: formData.get('name') as string,
      specialties: (formData.get('specialties') as string).split(',').map(s => s.trim()),
      rating: 5.0,
      reviews: 0,
      location: 'Localização a definir',
      clinicAddress: formData.get('address') as string,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
      bio: 'Novo profissional cadastrado na rede.',
      fullBio: formData.get('bio') as string,
      price: 0,
      priceType: 'combined',
      acceptsOnline: true,
      education: ['Informação pendente'],
      schedule: MOCK_DOCTORS[0].schedule, // Inicializa com agenda padrão
      workConfig: MOCK_DOCTORS[0].workConfig
    };
    setDoctors([...doctors, newDoctor]);
    setSuccessMsg('Cadastro realizado! Aguardando aprovação.');
    setIsSuccess(true);
    e.currentTarget.reset();
    setTimeout(() => { setIsSuccess(false); setView('home'); }, 2000);
  };

  // Atualização de Configurações do Profissional
  const updateProfile = (updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === profProfile.id ? { ...d, ...updates } : d));
  };

  const updateWorkConfig = (field: string, value: any) => {
    const newConfig = { ...profProfile.workConfig, [field]: value };
    updateProfile({ workConfig: newConfig });
  };

  const updateBreak = (type: 'lunch' | 'dinner', field: string, value: any) => {
    const newBreaks = { 
      ...profProfile.workConfig.breaks, 
      [type]: { ...profProfile.workConfig.breaks[type], [field]: value }
    };
    updateWorkConfig('breaks', newBreaks);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Inter'] selection:bg-indigo-100 flex flex-col">
      <header className="h-20 border-b border-slate-50 sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div onClick={() => { setView('home'); setActiveDoctor(null); }} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white transition-all group-hover:bg-indigo-600">
               <i className="fas fa-plus-square text-lg"></i>
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic">Med<span className="text-indigo-600 not-italic">Agendar</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <button onClick={() => {setView('home'); setActiveDoctor(null);}} className={`text-[10px] font-black uppercase tracking-widest ${view === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Início</button>
            <button onClick={() => setView('professional_signup')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'professional_signup' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Cadastro Profissional</button>
            <button onClick={() => setView('professional_dashboard')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'professional_dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Painel Profissional</button>
            <button onClick={() => setView('admin_dashboard')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'admin_dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Painel ADM</button>
          </nav>

          <div className="md:hidden">
            <i className="fas fa-bars text-slate-400"></i>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {isSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-[100] animate-in slide-in-from-top-4 flex items-center gap-3">
             <i className="fas fa-check-circle text-green-400"></i> {successMsg}
          </div>
        )}

        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="animate-in fade-in duration-500">
            {activeDoctor ? (
              /* Compact Detailed Profile */
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
                              {activeDoctor.specialties.map(s => <span key={s} className="text-indigo-600 font-bold text-[9px] uppercase tracking-[0.2em] bg-indigo-50 px-2 py-1 rounded-md">{s}</span>)}
                            </div>
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-slate-400 font-medium mb-6">
                            <span className="flex items-center gap-1.5"><i className="fas fa-star text-amber-400"></i> <b className="text-slate-900">{activeDoctor.rating}</b> ({activeDoctor.reviews} reviews)</span>
                            <span className="flex items-center gap-1.5"><i className="fas fa-map-marker-alt"></i> {activeDoctor.location}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-slate-500 max-w-2xl font-light">{activeDoctor.fullBio}</p>
                          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 inline-block text-[11px] text-slate-500">
                             <i className="fas fa-hospital mr-2 text-indigo-400"></i> <b>Endereço Clínica:</b> {activeDoctor.clinicAddress}
                             {activeDoctor.acceptsOnline && <span className="ml-4 text-green-600 font-bold uppercase"><i className="fas fa-video mr-1"></i> Atende Online</span>}
                          </div>
                       </div>
                    </div>
                    <div className="lg:col-span-8">
                       <div className="bg-white rounded-[40px] border border-slate-50 p-8 shadow-sm">
                          <h3 className="text-lg font-bold mb-8 tracking-tight flex items-center gap-2">Escolha um horário</h3>
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
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">{activeDoctor.priceType === 'fixed' ? 'Valor Fixo' : activeDoctor.priceType === 'clinic' ? 'No Local' : 'A Combinar'}</span>
                                <span className="text-2xl font-black">{activeDoctor.priceType === 'combined' ? 'A Combinar' : `R$ ${activeDoctor.price}`}</span>
                             </div>
                             <button disabled={!selectedSlot} onClick={confirmBooking} className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 disabled:opacity-20">Confirmar Agendamento</button>
                          </div>
                       </div>
                    </div>
                    <div className="lg:col-span-4 space-y-6">
                       <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Formação</h4>
                          <ul className="space-y-4">
                             {activeDoctor.education.map((edu, i) => <li key={i} className="flex gap-3 text-xs text-slate-500 leading-relaxed"><div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] text-indigo-400 border border-slate-100 flex-shrink-0"><i className="fas fa-check"></i></div>{edu}</li>)}
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
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Profissionais Disponíveis ({filteredDoctors.length})</h2>
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

        {/* CADASTRO PROFISSIONAL VIEW */}
        {view === 'professional_signup' && (
          <div className="max-w-2xl mx-auto px-6 py-20 animate-in fade-in">
             <h2 className="text-5xl font-black tracking-tighter mb-6">Junte-se à <span className="text-indigo-600">Elite.</span></h2>
             <p className="text-slate-400 font-light mb-12 text-lg">Cadastre seu consultório e comece a receber agendamentos inteligentes hoje mesmo.</p>
             <form onSubmit={handleProfessionalSignup} className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <input name="name" required type="text" placeholder="Nome Completo" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                  <input name="crm" required type="text" placeholder="CRM / Registro" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <input name="specialties" required type="text" placeholder="Especialidades (Separe por vírgula)" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                <input name="email" required type="email" placeholder="E-mail Profissional" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                <input name="address" required type="text" placeholder="Endereço da Clínica" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
                <textarea name="bio" required placeholder="Sua biografia completa para o perfil..." className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100 h-32"></textarea>
                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100">Concluir Cadastro</button>
             </form>
          </div>
        )}

        {/* PAINEL PROFISSIONAL VIEW */}
        {view === 'professional_dashboard' && (
          <div className="max-w-6xl mx-auto px-6 py-16 animate-in fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                   <h2 className="text-5xl font-black tracking-tighter mb-2">Painel <span className="text-indigo-600">Médico.</span></h2>
                   <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.4em]">Dr(a). {profProfile.name}</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                   <button onClick={() => setDashTab('overview')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dashTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Visão Geral</button>
                   <button onClick={() => setDashTab('config')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dashTab === 'config' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Gerenciar Clínica</button>
                </div>
             </div>

             {dashTab === 'overview' ? (
                <div className="animate-in fade-in">
                   <div className="grid md:grid-cols-4 gap-6 mb-12">
                      <div className="p-8 bg-indigo-600 rounded-[40px] text-white shadow-xl shadow-indigo-100">
                         <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-2">Consultas Hoje</p>
                         <h4 className="text-4xl font-black">{appointments.filter(a => a.doctorId === profProfile.id).length}</h4>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[40px]">
                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Pacientes Ativos</p>
                         <h4 className="text-4xl font-black text-slate-900">{profProfile.reviews + 10}</h4>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[40px]">
                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Faturamento Est.</p>
                         <h4 className="text-4xl font-black text-slate-900">R$ {profProfile.price * 15}</h4>
                      </div>
                      <div className="p-8 bg-slate-900 rounded-[40px] text-white">
                         <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">Avaliação</p>
                         <h4 className="text-4xl font-black">{profProfile.rating}</h4>
                      </div>
                   </div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-8">Agenda do Dia</h3>
                   <div className="space-y-4">
                      {appointments.filter(a => a.doctorId === profProfile.id).length > 0 ? appointments.filter(a => a.doctorId === profProfile.id).map(app => (
                        <div key={app.id} className="bg-white p-6 rounded-[32px] border border-slate-50 flex flex-col sm:flex-row justify-between items-center group hover:shadow-lg transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all"><i className="far fa-user"></i></div>
                              <div>
                                 <h4 className="font-bold tracking-tight text-slate-900">{app.patientName}</h4>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{app.time} • {app.date}</p>
                              </div>
                           </div>
                           <div className="flex gap-2 mt-4 sm:mt-0">
                              <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">Prontuário</button>
                              <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Atender</button>
                           </div>
                        </div>
                      )) : <div className="py-20 text-center text-slate-200 uppercase font-black text-xs tracking-widest">Sem compromissos marcados</div>}
                   </div>
                </div>
             ) : (
                <div className="grid lg:grid-cols-2 gap-10 animate-in fade-in">
                   <div className="space-y-8">
                      <div className="bg-slate-50 p-8 rounded-[48px] border border-slate-100 shadow-sm">
                         <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-indigo-600 flex items-center gap-3"><i className="fas fa-id-card"></i> Dados da Clínica</h3>
                         <div className="space-y-6">
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-300 block mb-2 ml-1">Especialidades Atendidas</label>
                               <div className="flex flex-wrap gap-2 mb-3">
                                  {profProfile.specialties.map(s => (
                                    <span key={s} className="bg-white px-3 py-1.5 rounded-xl text-[10px] font-bold text-indigo-600 border border-indigo-100 flex items-center gap-2 shadow-sm">
                                       {s} <i className="fas fa-times cursor-pointer hover:text-red-500" onClick={() => updateProfile({specialties: profProfile.specialties.filter(x => x !== s)})}></i>
                                    </span>
                                  ))}
                               </div>
                               <select 
                                 onChange={(e) => e.target.value && !profProfile.specialties.includes(e.target.value) && updateProfile({specialties: [...profProfile.specialties, e.target.value]})}
                                 className="w-full p-4 bg-white rounded-2xl border-none outline-none text-xs font-bold text-slate-500 shadow-sm"
                               >
                                  <option value="">+ Adicionar especialidade</option>
                                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                               </select>
                            </div>
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-300 block mb-2 ml-1">Endereço de Atendimento</label>
                               <input type="text" value={profProfile.clinicAddress} onChange={(e) => updateProfile({clinicAddress: e.target.value})} className="w-full p-4 bg-white rounded-2xl border-none outline-none text-xs font-bold text-slate-700 shadow-sm" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                               <p className="text-[10px] font-black uppercase text-slate-900">Oferecer Consultas Online</p>
                               <button onClick={() => updateProfile({acceptsOnline: !profProfile.acceptsOnline})} className={`w-12 h-6 rounded-full transition-all relative ${profProfile.acceptsOnline ? 'bg-green-500' : 'bg-slate-200'}`}>
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profProfile.acceptsOnline ? 'right-1' : 'left-1'}`}></div>
                               </button>
                            </div>
                         </div>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[48px] border border-slate-100 shadow-sm">
                         <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-indigo-600 flex items-center gap-3"><i className="fas fa-coins"></i> Honorários</h3>
                         <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-2">
                               {(['fixed', 'combined', 'clinic'] as const).map(type => (
                                 <button key={type} onClick={() => updateProfile({priceType: type})} className={`p-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${profProfile.priceType === type ? 'bg-slate-900 text-white' : 'bg-white text-slate-300'}`}>
                                    {type === 'fixed' ? 'Fixo' : type === 'combined' ? 'Combinado' : 'No Local'}
                                 </button>
                               ))}
                            </div>
                            {profProfile.priceType === 'fixed' && (
                               <input type="number" value={profProfile.price} onChange={(e) => updateProfile({price: Number(e.target.value)})} className="w-full p-4 bg-white rounded-2xl border-none outline-none text-lg font-black text-slate-900 shadow-sm" />
                            )}
                         </div>
                      </div>
                   </div>
                   <div className="bg-slate-900 p-10 rounded-[56px] text-white">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-indigo-400 flex items-center gap-3"><i className="fas fa-clock"></i> Horários e Pausas</h3>
                      <div className="space-y-10">
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Dias de Trabalho</p>
                            <div className="flex gap-2">
                               {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                 <button key={i} onClick={() => {
                                   const days = profProfile.workConfig.daysOfWeek;
                                   updateWorkConfig('daysOfWeek', days.includes(i) ? days.filter(x => x !== i) : [...days, i].sort());
                                 }} className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${profProfile.workConfig.daysOfWeek.includes(i) ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{d}</button>
                               ))}
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Expediente</label>
                               <div className="flex gap-2 items-center">
                                  <input type="time" value={profProfile.workConfig.startTime} onChange={(e) => updateWorkConfig('startTime', e.target.value)} className="bg-slate-800 p-3 rounded-xl border-none text-xs font-bold w-full" />
                                  <input type="time" value={profProfile.workConfig.endTime} onChange={(e) => updateWorkConfig('endTime', e.target.value)} className="bg-slate-800 p-3 rounded-xl border-none text-xs font-bold w-full" />
                               </div>
                            </div>
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Consulta (min)</label>
                               <select value={profProfile.workConfig.slotDuration} onChange={(e) => updateWorkConfig('slotDuration', Number(e.target.value))} className="bg-slate-800 p-3 rounded-xl border-none text-xs font-bold w-full outline-none">
                                  {[15, 30, 45, 60].map(v => <option key={v} value={v}>{v} min</option>)}
                               </select>
                            </div>
                         </div>
                         <div className="space-y-6 pt-6 border-t border-slate-800">
                            <div className="flex items-center justify-between">
                               <p className="text-xs font-bold">Pausa Almoço</p>
                               <button onClick={() => updateBreak('lunch', 'active', !profProfile.workConfig.breaks.lunch.active)} className={`w-10 h-5 rounded-full relative transition-all ${profProfile.workConfig.breaks.lunch.active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${profProfile.workConfig.breaks.lunch.active ? 'right-0.5' : 'left-0.5'}`}></div>
                               </button>
                            </div>
                            {profProfile.workConfig.breaks.lunch.active && (
                               <div className="flex gap-4 items-center animate-in fade-in">
                                  <input type="time" value={profProfile.workConfig.breaks.lunch.start} onChange={(e) => updateBreak('lunch', 'start', e.target.value)} className="bg-slate-800 p-3 rounded-xl border-none text-[10px] font-bold w-full" />
                                  <input type="time" value={profProfile.workConfig.breaks.lunch.end} onChange={(e) => updateBreak('lunch', 'end', e.target.value)} className="bg-slate-800 p-3 rounded-xl border-none text-[10px] font-bold w-full" />
                               </div>
                            )}
                         </div>
                         <button onClick={() => {setSuccessMsg('Agenda atualizada!'); setIsSuccess(true); setTimeout(() => setIsSuccess(false), 2000);}} className="w-full py-5 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all">Salvar Alterações</button>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {/* ADMIN VIEW */}
        {view === 'admin_dashboard' && (
          <div className="max-w-6xl mx-auto px-6 py-16 animate-in fade-in">
             <div className="mb-16">
                <h2 className="text-5xl font-black tracking-tighter mb-2">Painel <span className="text-indigo-600">ADM.</span></h2>
                <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.4em]">Gerenciamento Global</p>
             </div>
             <div className="grid lg:grid-cols-4 gap-6 mb-16">
                <div className="p-10 border border-slate-100 rounded-[48px] bg-slate-50">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Profissionais</p>
                   <h4 className="text-5xl font-black text-slate-900">{doctors.length}</h4>
                </div>
                <div className="p-10 border border-slate-100 rounded-[48px] bg-indigo-50">
                   <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Agendamentos</p>
                   <h4 className="text-5xl font-black text-indigo-600">{appointments.length}</h4>
                </div>
                <div className="p-10 border border-slate-100 rounded-[48px]">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Aprovações</p>
                   <h4 className="text-5xl font-black text-slate-900">0</h4>
                </div>
                <div className="p-10 bg-slate-900 rounded-[48px] text-white">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Receita Total</p>
                   <h4 className="text-4xl font-black">R$ 42.8k</h4>
                </div>
             </div>
             <div className="bg-white p-10 rounded-[56px] border border-slate-50 shadow-sm">
                <h3 className="text-lg font-black uppercase tracking-widest mb-10">Profissionais na Rede</h3>
                <div className="space-y-4">
                   {doctors.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl group transition-all hover:bg-slate-50">
                         <div className="flex items-center gap-6">
                            <img src={doc.image} className="w-12 h-12 rounded-2xl object-cover" />
                            <div>
                               <p className="font-bold text-slate-900">{doc.name}</p>
                               <div className="flex gap-1 mt-1">
                                  {doc.specialties.map(s => <span key={s} className="text-[8px] text-slate-400 uppercase font-black tracking-widest bg-white px-2 py-0.5 rounded border border-slate-100">{s}</span>)}
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-4 items-center">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">#{doc.id}</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <button onClick={() => setDoctors(doctors.filter(d => d.id !== doc.id))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors shadow-sm"><i className="fas fa-trash text-[10px]"></i></button>
                         </div>
                      </div>
                   ))}
                </div>
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

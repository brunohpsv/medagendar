
import React, { useState } from 'react';
import { Doctor } from '../types';

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onConfirm: (slot: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onConfirm }) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Agendar</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-50" />
            <div>
              <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
              <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest">{doctor.specialty}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Horários Disponíveis</p>
            <div className="grid grid-cols-3 gap-2">
              {doctor.availableSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedSlot === slot 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl mb-8 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valor</span>
            <span className="text-lg font-semibold text-slate-900">R$ {doctor.price}</span>
          </div>

          <button
            onClick={() => selectedSlot && onConfirm(selectedSlot)}
            disabled={!selectedSlot}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-20 shadow-lg shadow-indigo-100"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;


import React from 'react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onClick: (doc: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  return (
    <div 
      onClick={() => onClick(doctor)}
      className="bg-white rounded-3xl p-5 border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all cursor-pointer group flex flex-col sm:flex-row items-center gap-6"
    >
      <div className="relative">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-20 h-20 rounded-2xl object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
        />
        {doctor.acceptsOnline && (
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-lg text-[8px] font-black uppercase tracking-widest border-2 border-white shadow-sm">
            Online
          </div>
        )}
      </div>
      
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {doctor.name}
          </h3>
          <span className="text-[9px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">#{doctor.id}</span>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-start gap-1 mb-2">
          {doctor.specialties.map(s => (
            <span key={s} className="text-indigo-600 text-[9px] font-black uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">{s}</span>
          ))}
        </div>
        
        <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <i className="fas fa-star text-amber-400"></i>
            <b className="text-slate-700">{doctor.rating}</b>
          </span>
          <span className="flex items-center gap-1">
            <i className="fas fa-map-marker-alt"></i>
            {doctor.location}
          </span>
        </div>
      </div>

      <div className="text-right hidden sm:block border-l border-slate-50 pl-6">
        <p className="text-[9px] text-slate-300 font-bold uppercase mb-1 tracking-widest">
          {doctor.priceType === 'fixed' ? 'Valor Fixo' : doctor.priceType === 'clinic' ? 'No Local' : 'A Combinar'}
        </p>
        <p className="text-xl font-black text-slate-900">
          {doctor.priceType === 'combined' ? '---' : `R$ ${doctor.price}`}
        </p>
      </div>
    </div>
  );
};

export default DoctorCard;

'use client';

import { MessageCircle, Instagram, Facebook, Linkedin } from 'lucide-react';

export function FloatingIcons() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const instagramLink = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '';
  const facebookLink = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '';
  const linkedinLink = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || '';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I have a question.')}`;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-50">
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors">
        <MessageCircle size={24} />
      </a>
      <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors">
        <Instagram size={24} />
      </a>
      <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
        <Facebook size={24} />
      </a>
      <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="bg-blue-800 text-white p-3 rounded-full shadow-lg hover:bg-blue-900 transition-colors">
        <Linkedin size={24} />
      </a>
    </div>
  );
}

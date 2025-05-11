import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

interface ContactProps {
  language: 'en' | 'pt';
}

// Define translations for the Contact component
const translations = {
  en: {
    title: "Contact Us",
    address: "Address",
    phone: "Phone",
    email: "Email",
    hours: "Hours",
    
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    sendButton: "Send Message",
    sendingButton: "Sending...",
    successMessage: "Message sent successfully! We will get back to you soon.",
    errorMessage: "Failed to send message. Please try again.",
    schedule: "Thursday - Tuesday: 05:00 PM - 10:00 PM"
  },
  pt: {
    title: "Contacte-nos",
    address: "Endereço",
    phone: "Telefone",
    email: "Email",
    hours: "Horário",
    
    nameLabel: "Nome",
    emailLabel: "Email",
    messageLabel: "Mensagem",
    sendButton: "Enviar Mensagem",
    sendingButton: "A enviar...",
    successMessage: "Mensagem enviada com sucesso! Entraremos em contacto em breve.",
    errorMessage: "Falha ao enviar mensagem. Por favor, tente novamente.",
    schedule: "Quinta - Terça: 17:00 - 22:00 "
  }
};

const Contact: React.FC<ContactProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Get the appropriate translations based on the current language
  const text = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      setSubmitStatus({
        type: 'success',
        message: text.successMessage
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus({
        type: 'error',
        message: text.errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact form component
  const ContactForm = (
    <div className="backdrop-blur-sm bg-black/40 p-8 rounded-lg border border-amber-400/20 shadow-xl">
      {submitStatus.type && (
        <div className={`mb-6 p-4 rounded-md ${
          submitStatus.type === 'success' ? 'bg-green-900/60 text-green-300 border border-green-500/30' : 'bg-red-900/60 text-red-300 border border-red-500/30'
        }`}>
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-amber-300  mb-2">{text.nameLabel}</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="block w-full rounded-md border-amber-600/30 bg-black/70 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 placeholder-gray-500 glowy-placeholder"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-amber-300 mb-2">{text.emailLabel}</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full rounded-md border-amber-600/30 bg-black/70 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 placeholder-gray-500 glowy-placeholder"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-amber-300 mb-2">{text.messageLabel}</label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="block w-full rounded-md border-amber-600/30 bg-black/70 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 placeholder-gray-500 glowy-placeholder"
            required
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="w-full bg-amber-500 text-black font-bold px-6 py-3 rounded-md hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? text.sendingButton : text.sendButton}
        </button>
      </form>
    </div>
  );

  // Contact details component
  const ContactDetails = (
    <div className="backdrop-blur-sm bg-black/40 p-8 rounded-lg border border-amber-400/20 shadow-xl">
      <div className="space-y-8">
        <div className="flex items-start space-x-4">
          <MapPin className="w-7 h-7 text-amber-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white text-lg">{text.address}</h3>
            <p className="text-gray-300">Largo Salazar Moscoso, Lote 4, Loja A, 8600-522, Lagos</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Phone className="w-7 h-7 text-amber-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white text-lg">{text.phone}</h3>
            <p className="text-gray-300"> +(351) 920 221 805 </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Mail className="w-7 h-7 text-amber-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white text-lg">{text.email}</h3>
            <p className="text-gray-300">bluewhalelagos@gmail.com </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Clock className="w-7 h-7 text-amber-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white text-lg">{text.hours}</h3>
            <p className="text-gray-300">{text.schedule}</p>
            
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="contact" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        
        {/* Grid container with reordered children for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Order of these divs is changed for mobile - form first, then details */}
          <div className="md:order-2 mb-16 md:mb-0">
            {ContactForm}
          </div>
          
          <div className="md:order-1">
            {ContactDetails}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

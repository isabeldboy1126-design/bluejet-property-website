import React from 'react';
import { getCompanyConfig, getEstates } from '@/lib/config';
import { OfficeAddressCard } from '@/components/proof/OfficeAddressCard';
import { OpenModalButton } from '@/components/conversion/OpenModalButton';
import { 
  Calendar, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';

export const metadata = {
  title: 'Contact & Office Visit | Veritas Crest Properties',
  description: 'Visit our Victoria Island headquarters, schedule a Saturday site inspection, or speak directly with our estate surveyor team.',
};

export default function ContactPage() {
  const company = getCompanyConfig();
  const estates = getEstates();

  const faqs = [
    {
      q: 'Can my solicitor conduct an independent title search before I make any payment?',
      a: 'Yes, absolutely. We provide official survey numbers, beacon coordinates, and title gazette references to prospective buyers and their legal counsel specifically for independent verification at the State Lands Bureau.',
    },
    {
      q: 'Are weekend physical site inspections free?',
      a: 'Yes. Our scheduled Saturday site inspections are completely free of charge and obligation-free. Air-conditioned shuttles depart our Victoria Island office every Saturday at 9:00 AM.',
    },
    {
      q: 'Can I do a live virtual walkthrough if I am outside Nigeria?',
      a: 'Yes. For diaspora clients, our site engineers conduct live high-definition video walkthroughs using WhatsApp or Zoom, walking boundaries and answering questions in real-time.',
    },
    {
      q: 'When do I receive physical beacon allocation?',
      a: 'Physical allocation occurs upon completion of documentation for outright purchases, or upon reaching the contractual milestone agreed in installment schedules. You will physically stand on your plot and identify boundary beacons.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="border-b border-[var(--theme-border)] pb-8 max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-[var(--theme-tag-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-tag-text)]">
          DIRECT DEVELOPER ENGAGEMENT
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--theme-text)]">
          Contact & Visit Our Office
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--theme-muted)] leading-relaxed">
          Whether you want to inspect title files in person, join our scheduled weekend site tour, or arrange a diaspora video walkthrough, our team is directly accessible.
        </p>
      </div>

      {/* Quick Contact & Action Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-bg)] border border-[var(--theme-border)] w-fit text-[var(--theme-accent)] mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              Site Inspection
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--theme-muted)] leading-relaxed">
              Book a seat on our Saturday inspection shuttle or request a private weekday visit with a project surveyor.
            </p>
          </div>
          <div className="mt-6">
            <OpenModalButton variant="primary" className="w-full text-xs py-2.5">
              <span>Book Inspection</span>
            </OpenModalButton>
          </div>
        </div>

        <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="p-2 rounded-[var(--border-radius-base)] bg-emerald-50 border border-emerald-200 w-fit text-emerald-600 mb-4">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              WhatsApp Desk
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--theme-muted)] leading-relaxed">
              Fastest route for receiving estate brochures, plot layout PDFs, beacon coordinates, and payment options.
            </p>
          </div>
          <div className="mt-6">
            <a
              href={`https://wa.me/${company.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-bold text-xs rounded-[var(--border-radius-base)] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-bg)] border border-[var(--theme-border)] w-fit text-[var(--theme-accent)] mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              Direct Phone Call
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--theme-muted)] leading-relaxed">
              Speak directly with an estate advisory manager regarding bulk plot acquisition or commercial land parcels.
            </p>
          </div>
          <div className="mt-6">
            <a
              href={`tel:${company.contact.phonePrimary}`}
              className="w-full inline-flex items-center justify-center font-bold text-xs rounded-[var(--border-radius-base)] py-2.5 px-4 border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors"
            >
              <span>Call {company.contact.phonePrimary}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Physical Office Card */}
      <section>
        <OfficeAddressCard company={company} />
      </section>

      {/* Diligence FAQs */}
      <section className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[var(--theme-accent)]" />
          <h2 className="text-xl font-bold text-[var(--theme-text)]">
            Frequently Asked Diligence Questions
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-5"
            >
              <h3 className="text-sm font-bold text-[var(--theme-text)]">
                {faq.q}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--theme-muted)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      style={{ backgroundColor: "#F8FAFC" }}
      className="w-full border-t border-slate-200/80 pt-12 pb-14 text-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200/80">
          {/* Col 1: Logo & Company Identity */}
          <div className="space-y-3">
            <div className="flex items-center">
              <img
                src="/images/bluejet-logo.png"
                alt="BLUEJET PROPERTIES"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="font-bold text-base text-slate-900">
              BLUEJET PROPERTIES
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              [SHORT COMPANY DESCRIPTION / TAGLINE]
            </p>
          </div>

          {/* Col 2: Physical Office Address */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Office Location
            </h3>
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-[#025CDE] shrink-0 mt-0.5" />
              <span>[PHYSICAL OFFICE ADDRESS]</span>
            </div>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Direct Contact
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#025CDE] shrink-0" />
                <span>[CONTACT PHONE]</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#025CDE] shrink-0" />
                <span>[CONTACT EMAIL]</span>
              </div>
            </div>
          </div>

          {/* Col 4: Statutory Disclosure */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Diligence Notice
            </h3>
            <div className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
              <Shield className="w-4 h-4 text-[#025CDE] shrink-0 mt-0.5" />
              <span>[STATUTORY / REGULATORY NOTICE]</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Links & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-6">
            <Link href="/#properties" className="hover:text-slate-900 transition-colors">
              Properties
            </Link>
            <Link href="/#locations" className="hover:text-slate-900 transition-colors">
              Locations
            </Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </div>

          <div>
            © 2026 BLUEJET PROPERTIES. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

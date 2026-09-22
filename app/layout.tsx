import type { Metadata } from 'next';
import './globals.css';
import { getCompanyConfig, getStrategyConfig, getEstates } from '@/lib/config';
import { AppShell } from '@/components/global/AppShell';

const company = getCompanyConfig();
const strategy = getStrategyConfig();

export const metadata: Metadata = {
  title: `${company.companyName} | ${company.tagline || 'Serviced Estate Plots & Verified Land Developments'}`,
  description: strategy.hero.subheadline || 'Verifiable residential and commercial estate land with statutory title documentation across prime growth corridors.',
  keywords: ['estate land for sale', 'Lagos land', 'Epe land', 'Sagamu plots', 'Guzape Abuja land', 'verified property title Nigeria'],
  authors: [{ name: company.legalEntityName }],
  openGraph: {
    title: company.companyName,
    description: strategy.hero.subheadline,
    type: 'website',
    locale: 'en_NG',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const estates = getEstates();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <AppShell company={company} strategy={strategy} estates={estates}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}

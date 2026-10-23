import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import { SessionProvider } from '@/lib/session';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bastion',
  description: 'Peer-to-peer freelance personal training marketplace'
};

const stylesheets = [
  'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Sans:wght@300;400;600&family=Inter:wght@400;700&family=Jost:wght@600&family=Montserrat:wght@500;600;700&family=Quicksand:wght@500&display=swap',
  '/css/bastion-templates.css',
  '/css/home.css',
  '/css/desktop/homepage.css',
  '/css/create-account.css',
  '/css/survey.css',
  '/css/dashboard.css',
  '/css/admin.css',
  '/css/clients.css',
  '/css/clientPreview.css',
  '/css/coachOffer.css',
  '/css/coachJoin.css',
  '/css/chat.css',
  '/css/messageHome.css',
  '/css/thanks.css',
  '/css/editProfile.css',
  '/css/editSubscription.css',
  '/css/croppr.css'
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="https://uploads-ssl.webflow.com/6254580345036e67d0add6c0/6256278ee553ab33b2cba289_20220411_221335_0000.png" />
        {stylesheets.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <script src="/resources/js/fontawesome.js" defer />
      </head>
      <body>
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}

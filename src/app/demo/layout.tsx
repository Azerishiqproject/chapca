import { TimerProvider } from './TimerContext';
import { Navbar } from './Navbar';
import { PasswordProtection } from './PasswordProtection';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PasswordProtection>
      <TimerProvider>
        <Navbar />
        {children}
      </TimerProvider>
    </PasswordProtection>
  );
}


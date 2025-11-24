import { TimerProvider } from './TimerContext';
import { Navbar } from './Navbar';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimerProvider>
      <Navbar />
      {children}
    </TimerProvider>
  );
}


import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Wifi, WifiOff } from 'lucide-react';

interface DesktopStatusProps {
  className?: string;
}

export default function DesktopStatus({ className = '' }: DesktopStatusProps) {
  const [isElectron, setIsElectron] = useState(false);
  const [platform, setPlatform] = useState('unknown');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(!!window.electronAPI);
    
    // Get platform info
    if (window.nodeAPI) {
      setPlatform(window.nodeAPI.platform);
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isElectron) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
        <Smartphone className="h-4 w-4" />
        <span>Web Version</span>
      </div>
    );
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case 'win32':
        return '🪟';
      case 'darwin':
        return '🍎';
      case 'linux':
        return '🐧';
      default:
        return '💻';
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'win32':
        return 'Windows';
      case 'darwin':
        return 'macOS';
      case 'linux':
        return 'Linux';
      default:
        return 'Desktop';
    }
  };

  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      {/* Desktop indicator */}
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Monitor className="h-4 w-4" />
        <span className="font-medium">Desktop App</span>
      </div>

      {/* Platform info */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <span>{getPlatformIcon()}</span>
        <span>{getPlatformName()}</span>
      </div>

      {/* Connection status */}
      <div className={`flex items-center gap-2 ${
        isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Offline</span>
          </>
        )}
      </div>
    </div>
  );
}

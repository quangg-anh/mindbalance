import React from 'react';

export interface OfflineBannerProps {
  /** Override được dùng cho test hoặc demo. Bỏ qua sẽ dùng navigator.onLine. */
  isOnline?: boolean;
}

export function OfflineBanner({ isOnline }: OfflineBannerProps): React.ReactElement | null {
  const [online, setOnline] = React.useState<boolean>(() => {
    if (isOnline !== undefined) return isOnline;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  React.useEffect(() => {
    if (isOnline !== undefined) {
      setOnline(isOnline);
      return;
    }
    const goOffline = () => setOnline(false);
    const goOnline = () => setOnline(true);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, [isOnline]);

  if (online) return null;
  return (
    <div className="offline-banner" role="status" aria-live="polite">
      <span aria-hidden="true">⚠</span>
      <span>Đang ngoại tuyến — Tiến trình lưu cục bộ, đồng bộ sẽ tiếp tục khi có mạng.</span>
    </div>
  );
}

export default OfflineBanner;
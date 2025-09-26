import { useEffect, useState } from "react";

interface MessageProps {
  error?: string | null;
  success?: string | null;
}

export const MessageCenter = ({ error, success }: MessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (error || success) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000); 
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (!visible) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-10">
      {error && (
        <div className="bg-red-600 text-white rounded-lg shadow-lg px-6 py-3 text-center animate-fadeIn">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-600 text-white rounded-lg shadow-lg px-6 py-3 text-center animate-fadeIn">
          ✅ {success}
        </div>
      )}
    </div>
  );
};

export const MessageRight = ({ error, success }: MessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (error || success) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-4 z-10">
      {error && (
        <div className="bg-red-600 text-white rounded-lg shadow-lg px-6 py-3 text-center animate-fadeIn">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-600 text-white rounded-lg shadow-lg px-6 py-3 text-center animate-fadeIn">
          ✅ {success}
        </div>
      )}
    </div>
  );
};


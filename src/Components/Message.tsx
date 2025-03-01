import { useEffect, useState } from "react";
import Button from "./Button";
import AdminValidator from "../Api/AdminValidator";

interface MessageProps {
  error?: string | null;
  success?: string | null;
}

export const MessageCenter = ({ error, success }: MessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (error || success) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000); // Auto-dismiss after 5 seconds
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

export const ContinuationMessage = ({message} : {message: string}) => {
  const {show, setShow, navigate} = AdminValidator()
  return (
    <div
          className={`bg-primary text-white fixed top-10 h-fit rounded-lg justify-center items-center z-10 transition-all duration-500 ease-in-out flex flex-col ${
            show ? "w-[200px] opacity-100" : "w-0 opacity-0"
          } py-2 px-3`}
        >
          <p className="text-lg font-poppins font-semibold text-center">{message}</p>
          <span className="flex flex-row gap-5 items-center justify-between">
            <Button
              onSmash={() => setShow(false)}
              styles="hover:bg-green-400 bg-shadow rounded-full"
              router=""
              buttonText="yes"
            />
            <Button
              onSmash={() => navigate("/")}
              styles="hover:bg-green-400 bg-shadow rounded-full"
              router="/"
              buttonText="no"
            />
          </span>
        </div>
  )
}

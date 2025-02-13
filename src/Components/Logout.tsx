const Logout = ({
  onsmash,
  styles,
}: {
  onsmash: () => void;
  styles: string;
}) => {
  return (
    <button
      onClick={onsmash}
      className={`bg-red-500 py-2 xs:px-4 px-2 xs:text-[16px] text-[12px] ${styles} font-[400] rounded-full text-white hover:bg-red-600`}
    >
      Logout
    </button>
  );
};

export default Logout;

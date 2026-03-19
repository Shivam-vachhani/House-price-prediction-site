interface FieldErrorProps {
  msg?: string;
}

const FieldError = ({ msg }: FieldErrorProps) =>
  msg ? (
    <p className="text-[11px] text-red-500 flex items-center gap-1 mt-0.5">
      <svg
        viewBox="0 0 12 12"
        fill="currentColor"
        className="w-3 h-3 flex-shrink-0"
      >
        <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1zm.5 7.5h-1v-1h1v1zm0-2h-1V3h1v3.5z" />
      </svg>
      {msg}
    </p>
  ) : null;

export default FieldError;

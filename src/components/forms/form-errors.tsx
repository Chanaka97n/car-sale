import { cn } from "cn";

/** Inline validation message under a field (from react-hook-form `errors.x?.message`). */
export function FieldError({
  id,
  message,
  className,
}: {
  /** Referenced by the input's aria-describedby. */
  id?: string;
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={cn("mt-1 text-xs text-red-400", className)}>
      {message}
    </p>
  );
}

/** Form-level error (react-hook-form `errors.root.server`), e.g. an API rejection. */
export function FormError({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={cn(
        "text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2",
        className,
      )}
    >
      {message}
    </p>
  );
}

/** aria props for an input bound to a field that may have an error. */
export function fieldAria(id: string, message?: string) {
  return {
    "aria-invalid": message ? true : undefined,
    "aria-describedby": message ? `${id}-error` : undefined,
  } as const;
}

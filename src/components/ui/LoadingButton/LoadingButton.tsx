import React from "react"
import { Spinner } from "../Spinner"

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  spinnerSize?: number
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  spinnerSize = 24,
  disabled,
  children,
  ...rest
}) => {
  return (
    <button
      disabled={disabled || loading}
      className="cursor-pointer mt-3 px-4 py-2 rounded-xl font-medium flex items-center justify-center transition bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:opacity-60 disabled:active:scale-100"
      {...rest}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <Spinner size={spinnerSize} />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  )
}

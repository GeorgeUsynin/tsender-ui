type SpinnerProps = {
  size?: number // px
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 16 }) => {
  return (
    <div
      className="mx-auto inline-block animate-spin rounded-full border-3 border-gray-300 border-t-transparent dark:border-gray-400 dark:border-t-transparent"
      style={{ width: size, height: size }}
    />
  )
}

type InputFieldProps = {
  label: string
  placeholder?: string
  value: string
  type?: string
  large?: boolean
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "",
  value,
  type = "text",
  large = false,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-base font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {large ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`border rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 min-h-28`}
          name={label}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20`}
          name={label}
        />
      )}
    </div>
  )
}

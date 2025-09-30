import React, { useState, useCallback, useRef } from "react"
import type { ThemeConfig } from "../../themes/color-theme"
import { DropdownMenu } from "./dropdown-menu"

type DropdownItem = {
  label: string
  onClick: () => void
}

const isValidValue = <T extends string | number>(value: unknown): value is T => {
  return value !== undefined && value !== ""
}

interface BaseInputProps<T extends string | number = string> {
  themeConfig: ThemeConfig
  label?: string
  error?: string
  className?: string
  labelClassName?: string
  clearable?: boolean
  disabled?: boolean
  placeholder?: string
  value?: T
  onChange?: (value: T) => void
}

interface InputProps<T extends string | number = string> extends BaseInputProps<T> {
  type?: "text" | "number" | "password" | "email" | "tel" | "url"
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

interface SelectProps<T extends string | number = string> extends BaseInputProps<T> {
  options: Array<{ value: T; label: string }>
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const getBaseClassName = (themeConfig: ThemeConfig, hasError: boolean = false): string => {
  return `w-full px-3 py-2 border rounded text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
    hasError ? "border-red-500 focus:border-red-500 focus:ring-red-200" : `border-gray-300 focus:${themeConfig?.border} focus:ring-${themeConfig?.primary}-200`
  } hover:border-gray-400`
}

export const Input: React.FC<InputProps> = ({ themeConfig, label, error, className = "", value, labelClassName, disabled, clearable = true, onChange, ...props }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const hasValue: boolean = isValidValue<string>(value)
  const shouldFloat: boolean = isFocused || hasValue

  const handleClear = useCallback(() => {
    if (onChange) {
      onChange("")
    }
  }, [onChange])

  const showClearButton = clearable && hasValue && !disabled

  return (
    <div className={`mt-4 ${className}`}>
      <div className="relative text-gray-900">
        <input
          {...props}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={`${getBaseClassName(themeConfig, !!error)} ${disabled ? "cursor-not-allowed" : "initial:cursor-text"} ${showClearButton ? "pr-8" : ""}`}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
        />
        {showClearButton && (
          <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <i className="fas fa-times text-xs"></i>
          </button>
        )}
        {label && (
          <label
            className={`absolute left-2 transition-all truncate max-w-[80%] duration-200 pointer-events-none bg-white px-1 ${shouldFloat ? "-top-2 text-xs text-gray-400" : "top-[50%] translate-y-[-50%] text-sm text-gray-500"} ${
              error ? "text-red-500" : ""
            } ${labelClassName || ""}`}
          >
            {label}
          </label>
        )}
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  )
}

export const Select = <T extends string | number>({ themeConfig, label, error, value, onChange, options, className = "", disabled, labelClassName, clearable = true, ...props }: SelectProps<T>) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const hasValue: boolean = isValidValue<T>(value)
  const shouldFloat: boolean = isFocused || hasValue
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : ""

  const handleOptionSelect = useCallback(
    (optionValue: T) => {
      onChange?.(optionValue)
      setIsFocused(false)
    },
    [onChange]
  )

  const handleClear = useCallback(() => {
    if (onChange) {
      onChange(undefined as unknown as T)
    }
  }, [onChange])

  const showClearButton = clearable && hasValue && !disabled

  const dropdownItems = options.map(
    (option) =>
      ({
        label: option.label,
        onClick: () => handleOptionSelect(option.value),
      } as const)
  )

  return (
    <div className={`mt-4 ${className}`} ref={ref}>
      <div className="relative text-gray-900">
        <DropdownMenu
          items={dropdownItems}
          isOpen={isFocused}
          itemClassName={themeConfig?.hoverBgLight}
          className="w-full"
          menuClassName="w-full top-[110%]"
          trigger={
            <input
              {...props}
              type="text"
              value={displayValue}
              readOnly
              disabled={disabled}
              className={`${getBaseClassName(themeConfig, !!error)} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              onFocus={(e) => {
                setIsFocused(true)
                props.onFocus?.(e)
              }}
              onBlur={(e) => {
                if (!ref.current?.contains(e.relatedTarget)) {
                  setIsFocused(false)
                  props.onBlur?.(e)
                }
              }}
            />
          }
        />
        {!hasValue && <i className="fas fa-chevron-down text-gray-400 text-xs absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"></i>}
        {showClearButton && (
          <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10">
            <i className="fas fa-times text-xs"></i>
          </button>
        )}
        {label && (
          <label
            className={`absolute left-2 transition-all duration-200 pointer-events-none bg-white px-1 ${shouldFloat ? "-top-2 text-xs text-gray-400" : "top-[50%] translate-y-[-50%] text-sm text-gray-500"} ${error ? "text-red-500" : ""} ${
              labelClassName || ""
            }`}
          >
            {label}
          </label>
        )}
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  )
}

interface TextAreaProps extends BaseInputProps {
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
}

export const TextArea: React.FC<TextAreaProps> = ({ themeConfig, label, error, className = "", value, labelClassName, disabled, clearable = true, onChange, ...props }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const hasValue: boolean = isValidValue<string>(value)
  const shouldFloat: boolean = isFocused || hasValue

  const handleClear = useCallback(() => {
    if (onChange) {
      onChange("")
    }
  }, [onChange])

  const showClearButton = clearable && hasValue && !disabled

  return (
    <div className={`mt-4 ${className}`}>
      <div className="relative text-gray-900">
        <textarea
          {...props}
          value={value}
          placeholder=""
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`${getBaseClassName(themeConfig, !!error)} resize-none py-1 ${disabled ? "cursor-not-allowed" : "initial:cursor-text"} ${showClearButton ? "pr-8" : ""}`}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
        />
        {showClearButton && (
          <button type="button" onClick={handleClear} className="absolute right-2 top-5 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <i className="fas fa-times text-xs"></i>
          </button>
        )}
        {label && (
          <label className={`absolute left-2 transition-all duration-200 pointer-events-none bg-white px-1 ${shouldFloat ? "-top-2 text-xs text-gray-400" : "top-3.5 text-sm text-gray-500"} ${error ? "text-red-500" : ""} ${labelClassName || ""}`}>
            {label}
          </label>
        )}
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  )
}

const InputComponents = {
  Input,
  Select,
  TextArea,
} as const

export default InputComponents

export type { BaseInputProps, InputProps, SelectProps, TextAreaProps }
export type { DropdownItem }

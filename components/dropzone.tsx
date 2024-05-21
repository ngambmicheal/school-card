import { InputGroup } from '@chakra-ui/react'
import React, { ReactNode, useRef } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
  children?: ReactNode
  onChange?: (e: FileList) => void
}

export default function FileUpload(props: FileUploadProps) {
  const { register, accept, multiple, children, onChange } = props

  const inputRef = useRef<HTMLInputElement | null>(null)

  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void
  }

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup
      onClick={handleClick}
      // @ts-expect-error
      onChange={(e) => onChange?.(e.target.files)}
      h="100%"
    >
      <input
        type={'file'}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
      />
      <>{children}</>
    </InputGroup>
  )
}

export function validateFiles(value: FileList) {
  if (value.length < 1) {
    return 'Files is required'
  }

  for (const file of Array.from(value)) {
    const fsMb = file.size / (1024 * 1024)
    const MAX_FILE_SIZE = 10

    if (fsMb > MAX_FILE_SIZE) {
      return 'Max file size 10mb'
    }
  }

  return true
}

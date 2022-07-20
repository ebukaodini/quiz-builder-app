import styled from "styled-components";

const StyledInput = styled.input`
  &::placeholder {
    color: ${props => props.theme.grey};
  }
  &:checked {
    border-color: ${props => props.theme.primary} !important;
  }
  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: ${props => props.theme.primary} !important;
  }
  &:active {
    border-color: ${props => props.theme.primary} !important;
  }
  &.error {
    border-color: ${props => props.theme.danger} !important;
  }
`
const StyledTextareaInput = styled.textarea`
    &::placeholder {
      color: ${props => props.theme.neut400};
    }
    &:checked {
      border-color: ${props => props.theme.pry400} !important;
    }
    &:focus {
      outline: none !important;
      box-shadow: none !important;
      border-color: ${props => props.theme.pry400} !important;
    }
    &:active {
      border-color: ${props => props.theme.pry400} !important;
    }
    &.error {
      border-color: ${props => props.theme.danger} !important;
    }
`
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <StyledInput {...props} className={`form-control rounded-0 p-3 text-dark ${props.className}`} />
}

export const TextareaInput: React.FC<React.InputHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  return <StyledTextareaInput rows={1} {...props} className={`form-control rounded-0 w-100 p-3 text-dark ${props.className}`} />
}

export const CheckboxInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <StyledInput {...props} type='checkbox' className={`form-check-input mb-2 border-dark text-dark ${props.className}`} />
}

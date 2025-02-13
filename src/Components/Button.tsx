
const Button = ({buttonText, styles} : {buttonText : string, styles: string}) => {
  return (
    <button type="submit" className={`py-3 px-7 ${styles}`}>
        {buttonText}
    </button>
  )
}

export default Button;
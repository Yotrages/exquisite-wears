import { Link } from "react-router-dom";

const Button = ({buttonText, styles, router, onSmash} : {buttonText : string, styles: string, router: string, onSmash: () => void}) => {
  return (
    <Link to={router} onClick={onSmash} type="submit" className={`bg-primary px-2 py-2 items-center justify-center ${styles}`}>
        {buttonText}
    </Link>
  )
}

export default Button;
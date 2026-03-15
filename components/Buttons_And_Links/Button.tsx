import Link from "next/link";

type ButtonVariant = "btn1" | "btn2" | "btn3" | "btn4" | "tag-link" | "btn5";

interface ButtonProps {
  title: string;
  variant: ButtonVariant;
  id?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  href: string;
}

const Button = ({ title, variant, id, leftIcon, rightIcon, className, href }: ButtonProps) => {
  return (
    <Link id={id} href={href} className={`${variant} btn-anim ${className ?? ""}`.trim()}>
      {leftIcon}
      <span className="btn-label">
        <span className="btn-label-primary">{title}</span>
        <span className="btn-label-secondary">{title}</span>
      </span>
      {rightIcon}
    </Link>
  );
};

export default Button;

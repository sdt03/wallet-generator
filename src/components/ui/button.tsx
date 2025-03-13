
interface ButtonProps {
    variant: "primary" | "secondary" | "destructive";
    size: "sm" | "md";
    text: string;
    onClick?: () => void;
    loading? : boolean;
    disabled?: boolean 
}

const buttonVariants = {
    variant: {
        primary: "bg-black-500 text-white border border-black-500 hover:bg-black",
        secondary: "bg-white text-black hover:bg-gray-300 disabled:bg-gray-300",
        destructive: "bg-red-800 text-white hover:bg-red-500"
    },
    size: {
        sm: "py-2 px-4 text-sm",
        md: "py-4 px-6 text-md rounded-lg min-w-50",
    }
}

export function Button({variant, size, text, onClick, loading, disabled}: ButtonProps) {
    return <div>
        <button onClick={onClick} className={`${buttonVariants.variant[variant]} ${buttonVariants.size[size]} ${disabled ? "cursor-not-allowed hover:" : "cursor-pointer"} font-semibold`} disabled={loading || disabled}>{text}</button>
    </div>
}


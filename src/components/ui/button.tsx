
interface ButtonProps {
    variant: "primary" | "secondary" | "destructive";
    size: "sm" | "md";
    text: string;
    onClick?: () => void;
    loading? : boolean;
}

const buttonVariants = {
    variant: {
        primary: "bg-black text-white border-gray-500 border",
        secondary: "bg-white text-black hover:bg-gray-300",
        destructive: "bg-red-800 text-white hover:bg-red-500"
    },
    size: {
        sm: "py-2 px-4 text-sm rounded-md",
        md: "py-4 px-6 text-md rounded-md",
    }
}

export function Button({variant, size, text, onClick, loading}: ButtonProps) {
    return <div>
        <button onClick={onClick} className={`${buttonVariants.variant[variant]} ${buttonVariants.size[size]} cursor-pointer`} disabled={loading}>{text}</button>
    </div>
}


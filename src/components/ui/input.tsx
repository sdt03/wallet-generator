interface InputProps {
    size: "sm" | "md" |"lg";
    value: string[];
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const sizeClasses = {
    "sm": "px-2 py-1 text-sm",
    "md": "px-3 py-2 text-lg",
    "lg": "px-4 py-3 text-xl",
};

export function Input({ size, value, onChange }: InputProps) {
    const inputArray = Array(12).fill("").map((_, index) => value[index] || "");    
    return (
        <div className="grid grid-cols-3 gap-4">
            {inputArray.map((word, index) => (
                <input
                    key={index}
                    className={`rounded-md bg-black-500 text-white border border-gray-500  ${sizeClasses[size]}`}
                    value={word}
                    onChange={(e) => onChange(index, e)}
                    placeholder={`${index + 1}`}
                />
            ))}
        </div>
    );
}
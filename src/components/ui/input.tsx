
interface InputProps{
    // text: string;
    size?: "sm" | "md" | "lg"
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ placeholder, value, onChange}: InputProps){
    return <div className="p-4">
        <input className = {`text-white border border-gray-500 rounded-md p-2 w-240`} placeholder={placeholder} value={value} onChange={onChange}  />
    </div>
}
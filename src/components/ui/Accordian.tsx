import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordianProps {
    title: string;
    isOpen: boolean;
    toggleOpen: () => void;
    children?: React.ReactNode;
}

export function Accordian({ title, isOpen, toggleOpen, children }: AccordianProps) {
    return (
        <div className="flex justify-center relative top-1/6">
            <div className="w-200 border border-gray-500 rounded-md mt-5 ml-45 mr-45">
                <div className="flex justify-between font-bold p-3 text-2xl">
                    {title}
                    <div
                        onClick={toggleOpen}
                        className="flex cursor-pointer hover:bg-slate-600 max-w-10 p-2 rounded-sm transition-transform duration-300"
                    >
                        {!isOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                    </div>
                </div>
                <div
                    className={`transition-all duration-500 overflow-hidden ${
                        isOpen ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
                    }`}
                >
                    <div className="p-3 bg-black-500 text-xl flex flex-wrap rounded-lg">{children}</div>
                </div>
            </div>
        </div>
    );
}

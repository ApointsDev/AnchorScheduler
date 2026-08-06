import React from "react";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled }) => {
    return (
        <div
            className={`toggle-switch ${checked ? "active" : ""}`}
            onClick={() => {
                if (!disabled) onChange(!checked);
            }}
            role="switch"
            aria-checked={checked}
            tabIndex={0}
            onKeyDown={(e) => {
                if (!disabled && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onChange(!checked);
                }
            }}
        >
            <div className="toggle-slider" />
        </div>
    );
};

export default Switch;

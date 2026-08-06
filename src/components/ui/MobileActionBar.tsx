import React, { createContext, useContext, useState, useCallback } from "react";
import "../../styles/MobileActionBar.css";

/* ── Context ──────────────────────────────────────────────────── */

interface MobileAction {
    id: string;
    content: React.ReactNode;
}

interface MobileActionBarContextType {
    register: (action: MobileAction) => void;
    unregister: (id: string) => void;
}

const MobileActionBarCtx = createContext<MobileActionBarContextType>({
    register: () => {},
    unregister: () => {},
});

export const useMobileActionBar = () => useContext(MobileActionBarCtx);

/* ── Provider ─────────────────────────────────────────────────── */

export const MobileActionBarProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [actions, setActions] = useState<MobileAction[]>([]);

    const register = useCallback((action: MobileAction) => {
        setActions((prev) => {
            const filtered = prev.filter((a) => a.id !== action.id);
            return [...filtered, action];
        });
    }, []);

    const unregister = useCallback((id: string) => {
        setActions((prev) => prev.filter((a) => a.id !== id));
    }, []);

    return (
        <MobileActionBarCtx.Provider value={{ register, unregister }}>
            {children}
            <MobileActionBar actions={actions} />
        </MobileActionBarCtx.Provider>
    );
};

/* ── Bar 组件 ─────────────────────────────────────────────────── */

const MobileActionBar: React.FC<{ actions: MobileAction[] }> = ({ actions }) => {
    if (actions.length === 0) return null;

    return (
        <div className="mobile-action-bar">
            <div className="mobile-action-bar-inner">
                {actions.map((a) => (
                    <React.Fragment key={a.id}>{a.content}</React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default MobileActionBar;

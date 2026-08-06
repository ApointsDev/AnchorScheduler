import { useTranslation } from "react-i18next";

const languages = [
    { code: "zh-CN", label: "中文" },
    { code: "en", label: "English" },
] as const;

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    return (
        <div className="lang-switcher">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    className={`lang-btn ${i18n.language === lang.code ? "lang-btn-active" : ""}`}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    title={lang.label}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;

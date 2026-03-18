import { useTranslation } from "react-i18next";

export default function Loader() {
  const { t } = useTranslation();
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF7F0] dark:bg-[#0D0D0D]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-[#C9A84C]/20" />
        <div className="absolute inset-0 rounded-full border-t border-[#C9A84C] animate-spin" />
        <div className="absolute inset-2 rounded-full border border-gray-100 dark:border-[#009A44]/20" />
      </div>
      <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]/70 animate-pulse">
        {t("common.synchronizing")}
      </p>
    </div>
  );
}

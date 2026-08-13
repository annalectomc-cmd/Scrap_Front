import type { Platform } from "../../types/scraping";

interface PlatformTabsProps {
    platform: Platform;
    onChange: (platform: Platform) => void;
}

const platforms: { value: Platform; label: string }[] = [
    {
        value: "tiktok",
        label: "TikTok",
    },
    {
        value: "instagram",
        label: "Instagram",
    },
    {
        value: "youtube",
        label: "YouTube",
    },
];

export default function PlatformTabs({
    platform,
    onChange,
}: PlatformTabsProps) {
    return (
        <div className="d-flex gap-2 mb-4">
            {platforms.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    className={`btn ${platform === item.value
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                    onClick={() => onChange(item.value)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
import "../../styles/DashboardCard.css";

interface Props {
    title: string;
    icon: string;
    onClick?: () => void;
}

export default function DashboardCard({
    title,
    icon,
    onClick
}: Props) {

    return (

        <button
            className="dashboard-card"
            onClick={onClick}
        >

            <i className={`bi ${icon}`}></i>

            <span>{title}</span>

        </button>

    );

}
import classNames from "classnames";
import Tag from "@/components/ui/Tag";
import { Card } from "@/components/ui";
import useThemeClass from "@/utils/hooks/useThemeClass";

interface StatusProperties {
    label: string;
    class: string;
}

interface LayoutDetailSimpleProps {
    title: React.ReactNode;
    titleLink?: string;
    subtitle?: string;
    status: string;
    children: React.ReactNode;
    statusTags?: Record<string, StatusProperties>;
    actions?: React.ReactNode;
}

const LayoutDetailSimple: React.FC<LayoutDetailSimpleProps> = ({
    title,
    titleLink,
    subtitle,
    status,
    children,
    statusTags,
    actions,
}) => {
    const { borderTheme } = useThemeClass();

    return (
        <Card className={`h-full border-t-2 ${borderTheme} shadow-lg backdrop-blur-lg`}>
            <div>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2">
                    <div className="flex items-center mb-2 lg:mb-0 lg:mr-4">
                        {titleLink ? (
                            <a href={titleLink} target="_blank" rel="noopener noreferrer">
                                <h3>{title}</h3>
                            </a>
                        ) : (
                            <h3>{title}</h3>
                        )}

                        {statusTags && statusTags[status] && (
                            <Tag
                                className={classNames(
                                    "border-0 rounded-md ltr:ml-2 rtl:mr-2",
                                    "px-4 py-2 text-sm",
                                    statusTags[status].class
                                )}
                            >
                                {statusTags[status].label}
                            </Tag>
                        )}
                    </div>
                    {actions}
                </div>
                {subtitle && <span className="flex items-center">{subtitle}</span>}
                <div className="mt-4">{children}</div>
            </div>
        </Card>
    );
};

export default LayoutDetailSimple;

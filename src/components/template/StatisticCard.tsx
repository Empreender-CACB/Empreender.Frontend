import classNames from 'classnames'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { ReactNode } from 'react'

const GrowShrink = ({ value }: { value: number }) => {
    return (
        <span className="flex items-center rounded-full gap-1">
            <span
                className={classNames(
                    'rounded-full p-1',
                    value > 0 &&
                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
                    value < 0 &&
                        'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20'
                )}
            >
                {value > 0 ? '+' : ''}
                {value}
            </span>
        </span>
    )
}

const StatisticCard = ({
    icon,
    backgroundColor,
    textColor,
    label,
    value,
    growthValue,
    monthText = 'esse mês',
}: {
    icon: JSX.Element
    backgroundColor: string
    textColor: string
    label: string
    value: number
    growthValue: number
    monthText?: string
}) => {
    return (
        <Card>
            <div className="flex items-center gap-4">
                <Avatar
                    size={55}
                    className={`${backgroundColor} ${textColor}`}
                    icon={icon}
                />
                <div>
                    <div className="flex gap-1.5 items-end mb-2">
                        <h3 className="font-bold leading-none">{value}</h3>
                        <p className="font-semibold">{label}</p>
                    </div>
                    <p className="flex items-center gap-1">
                        <GrowShrink value={growthValue} />
                        <span>{monthText}</span>
                    </p>
                </div>
            </div>
        </Card>
    )
}

interface StatisticGroupProps {
    children: ReactNode;
}

const StatisticGroup: React.FC<StatisticGroupProps> = ({ children }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 my-8">
            {children}
        </div>
    );
};

export { StatisticCard, StatisticGroup };
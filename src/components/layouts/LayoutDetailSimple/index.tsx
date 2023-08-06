import classNames from 'classnames'
import Tag from '@/components/ui/Tag'
import { Card } from '@/components/ui'

interface StatusProperties {
    label: string
    class: string
}

interface LayoutDetailSimpleProps {
    title: string
    subtitle?: string
    status: string
    children: React.ReactNode
    paymentStatus: Record<string, StatusProperties>
    actions?: React.ReactNode
}

const LayoutDetailSimple: React.FC<LayoutDetailSimpleProps> = ({
    title,
    subtitle,
    status,
    children,
    paymentStatus,
    actions,
}) => {
    return (
        <Card className="h-full">
            <div>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2">
                    <div className="flex items-center mb-2 lg:mb-0 lg:mr-4">
                        <h3>
                            <span>{title}</span>
                        </h3>
                        <Tag
                            className={classNames(
                                'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                                paymentStatus[status].class
                            )}
                        >
                            {paymentStatus[status].label}
                        </Tag>
                    </div>
                    {actions}
                </div>
                {subtitle && (
                    <span className="flex items-center">{subtitle}</span>
                )}
                <div className='mt-4'>
                    {children}
                </div>
            </div>
        </Card>
    )
}

export default LayoutDetailSimple

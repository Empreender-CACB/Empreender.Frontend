import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaPinterestP,
} from 'react-icons/fa';
import { HiPencilAlt, HiOutlineTrash , HiEye} from 'react-icons/hi';

const CustomerInfoField = ({ title, value }) => {
    return (
        <div>
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {value}
            </p>
        </div>
    );
};


const CustomerProfile = () => {
    const mockCustomerData = {
        name: 'Nome do Representante',
        email: 'email@email.com',
        personalInfo: {
            phoneNumber: '61 99127-7623',
            location: 'Endereço',
            birthday: '04/07¹995',
            title: 'Cargo',
        },
    };

    return (
        <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="flex xl:flex-col items-center gap-4">
                    <Avatar size={90} shape="circle" src={mockCustomerData.img} />
                    <h4 className="font-bold">{mockCustomerData.name}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8">
                    <CustomerInfoField title="Email" value={mockCustomerData.email} />
                    <CustomerInfoField
                        title="Telefone"
                        value={mockCustomerData.personalInfo.phoneNumber}
                    />
                    <CustomerInfoField
                        title="Endereço"
                        value={mockCustomerData.personalInfo.location}
                    />
                    <CustomerInfoField
                        title="Nascimento"
                        value={mockCustomerData.personalInfo.birthday}
                    />
                    <CustomerInfoField
                        title="Cargo    "
                        value={mockCustomerData.personalInfo.title}
                    />
                </div>

            </div>
        </Card>
    );
};

export default CustomerProfile;

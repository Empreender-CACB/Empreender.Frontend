import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { HiChatAlt } from 'react-icons/hi'
import type { CommonProps } from '@//@types/common'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useAppSelector } from '@/store'
import DocumentosAjudaAtendimento from './DocumentosAjudaAtendimento'
import { Tag, Button } from '../ui'
import React, {useState, MouseEvent} from 'react'
import Dialog from '@/components/ui/Dialog'

type DropdownList = {
    label: string
    path?: any
    recurso?: string
    type?: string
    component?: any
}



const _AjudaAtendimento = ({ className }: CommonProps) => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const ajudaDropdownItemList: DropdownList[] = [
        {
            label: 'Aviso aos Navegantes',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/faq/blog`,
        },
        {
            label: 'Fale Conosco',
            path: 'mailto:suportepde@cacb.org.br?subject=Fale%20Conosco',
        },
        {
            label: 'FAQ',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/faq/index`,
        },
        {
            label: 'LGPD',
            type: 'component',
            component: 
                <Dropdown.Menu title='LGPD'>
                <Dropdown.Item className="flex h-full w-full px-2" onClick={() => openDialog()}>
                    Dúvidas
                </Dropdown.Item>
                <Dropdown.Item className="flex h-full w-full px-2">
                    <a target='__blank' href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/NTY0OQ==">Políticas de Cookies</a>
                </Dropdown.Item>
            </Dropdown.Menu>
    
        },
        {
            label: 'Liberações',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/liberacoes/`,
        },
        {
            label: 'Painel Covid',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/faq/paineis-zoho/painel/covid`,
        },
        {
            label: 'Painel Empreender',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/faq/paineis-zoho/painel/empreender`,
            recurso: 'paineis_zoho',
        },
    ]

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
    }

    const { recursos } = useAppSelector((state) => state.auth.user)

    const filteredItems = ajudaDropdownItemList.filter(
        (item) => !item.recurso || recursos.includes(item.recurso)
    )

    const AjudaAvatar = (
        <div className={classNames(className, 'flex items-center gap-2')}>
            <span className="text-xl opacity-50">
                <HiChatAlt />
            </span>
            <div className="hidden md:block">
                <div className="font-bold">Ajuda e Atendimento</div>
            </div>
        </div>
    )

    return (
        <div className='flex items-center'>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">LGPD</h5>
                <p>
A CACB está em constante processo de adequação à LGPD. Quaisquer dúvidas sobre o tema podem ser encaminhadas por correio eletrônico para  <a  className="text-blue-600" href="mailto:protecaodedados@cacb.org.br">protecaodedados@cacb.org.br</a>
                </p>
                <div className="text-right mt-6">

                    <Button variant="solid" onClick={onDialogOk}>
                        Ok
                    </Button>
                </div>
            </Dialog>

            <Dropdown
                openDown
                menuStyle={{ minWidth: 240 }}
                renderTitle={AjudaAvatar}
                placement="bottom-center"
            >
                {filteredItems.map((item) => (
                    <>
                    { 
                        React.isValidElement(item.component) ? (item.component) : (
                            <Dropdown.Item
                            key={item.label}
                            eventKey={item.label}
                            className="mb-1 px-0"
                        >
                        
                            <Link
                                className="flex h-full w-full px-2"
                                to={item.path}
                            >
                                <span className="flex gap-2 items-center w-full">
                                <span>{item.label}</span>
                                </span>
                            </Link>
    
                        </Dropdown.Item>
                            )
                    }                

                    </>

                    
                ))}
                {recursos.includes('doc_consul') ? (
                    <DocumentosAjudaAtendimento />
                    
                    
                ) : null}
                
            </Dropdown>
        </div>
    )
}

const AjudaAtendimento = withHeaderItem(_AjudaAtendimento)

export default AjudaAtendimento

import { Button, Dialog, Notification, Input, Upload, DatePicker } from '@/components/ui';
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react';
import ApiService from '@/services/ApiService';
import toast from '@/components/ui/toast'
import { HiCurrencyDollar, HiOutlineCloudUpload } from 'react-icons/hi'

const LancarPagamentoLancamento = ( data : any ) => { 
    
    const [dialogIsOpen, setIsOpen] = useState<boolean>(false)
    const [fileList, setFileList] = useState([])


    const handlLancarPagamentoDiagModal = () => {
        setIsOpen(!dialogIsOpen)
    }
    const navigate = useNavigate();

    const LancarPagamento = async (event) => {
        event.preventDefault()
        console.log(event?.fileList);

        const fields = ['nudocbancario', 'dtpagamento', 'comentario', 'files']

        const formData = new FormData()
        for (const field of fields) {
            if (event.target[field] === undefined) continue;
            formData.append(field, event.target[field].value);
            console.log(event.target[field].value)
        }

        try {
            await ApiService.fetchData({
                url: 'lancamentos/lancar-pagamento',
                method: 'POST',
                data: formData
            });
            navigate(`/sistema/lancamentos/transferencias-pagamentos/`);
        } catch (error: any) {
            toast.push(
                <Notification title={error.response?.data?.message} type="danger" />
            );
        }
    }

    const props = {
        onRemove: file => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          setFileList(newFileList);
        },
        beforeUpload: file => {
          setFileList([...fileList, file]);
          // Return false to stop auto-upload because we'll upload files manually later
          return false;
        },
        fileList,
      };

    return (
        <div>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={handlLancarPagamentoDiagModal}
                onRequestClose={handlLancarPagamentoDiagModal}
                style={{
                    content: {
                        marginTop: 250,
                    },
                }}
            >
                <h5 className="mb-4">Deseja realmente lançar o pagamento para o lançamento  {data.idlanc}?</h5>
                

                <FormContainer layout="vertical" labelWidth={100}>
                    <form onSubmit={LancarPagamento}>

                        <div className="mb-4">
                            <FormItem label="Nº do Documento Bancário">
                                <Input  type="text" id="nudocbancario" name="nudocbancario" />
                            </FormItem>
                        </div>
                        <div className="mb-4">
                            <FormItem label="Data do Pagamento">
                                <DatePicker name="dtpagamento" placeholder="dd/mm/aaaa" inputFormat="DD/MM/YYYY" />
                            </FormItem>
                        </div>
                        <div> 
                            <FormItem label="Comentário">
                                <Input textArea id="comentario"/>
                            </FormItem>
                        </div>

                        <div>
                            <FormItem label="Comprovantes" >
                                <Upload {...props} uploadLimit = {15}>
                                    <Button variant="solid" icon={<HiOutlineCloudUpload />}>
                                        Anexos
                                    </Button> 
                                </Upload>
                            </FormItem>
                        </div>

                        <div className="text-right mt-6 flex flex-col sm:flex-row justify-between">
                            <Button
                                className="ltr:mr-2 rtl:ml-2"
                                variant="plain"
                                type="submit"
                            >
                                Cancelar
                            </Button>
                            <Button variant="solid" type="submit">
                                Pagar
                            </Button>
                        </div>
                    </form>
                </FormContainer>
            </Dialog>
            <Button
                onClick={handlLancarPagamentoDiagModal}
                block
                variant="solid"
                size="lg"
                color="white"
                icon={<HiCurrencyDollar />}
            >
            </Button>
        </div>
    )
 };

export default LancarPagamentoLancamento
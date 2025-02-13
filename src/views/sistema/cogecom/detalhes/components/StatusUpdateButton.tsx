import { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import ApiService from '@/services/ApiService';
import { Alert } from '@/components/ui';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const statusUpdateSchema = Yup.object().shape({
  message: Yup.string().max(500, 'No máximo 500 caracteres.'),
});

interface StatusUpdateButtonProps {
  id: string;
  status_atual: 'analise' | 'aprovada' | 'recusada';
  setCogecomData: (data: any) => void;
}

const StatusUpdateButton = ({ id, status_atual, setCogecomData }: StatusUpdateButtonProps) => {
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'aprovada' | 'recusada'>();

  const openDialog = (status) => {
    if (status_atual !== 'analise') {
      toast.push(
        <Notification title="Ação Inválida" type="danger">
          O status só pode ser atualizado caso a candidatura esteja em análise. Contate o administrador caso seja necessário.
        </Notification>
      );
      return;
    }
    setSelectedStatus(status);
    setIsOpen(true);
  };

  const onDialogClose = () => {
    setIsOpen(false);
  };

  const handleStatusUpdate = async (values: { message?: string }) => {
    try {
      const formData = new FormData();
      formData.append('status', selectedStatus!);
      if (values.message) {
        formData.append('message', values.message);
      }

      const response = await ApiService.fetchData({
        url: `/cogecom/status/${id}`,
        method: 'post',
        data: formData,
      });

      setCogecomData(response.data);

      toast.push(
        <Notification title="Sucesso" type='success'>
          Status da adesão foi atualizado e um e-mail foi enviado.
        </Notification>
      );
    } catch (err) {
      //console.error(`Erro ao atualizar status para ${selectedStatus}:`, err);
      toast.push(
        <Notification title="Erro">
          Não foi possível atualizar o status da adesão.
        </Notification>
      );
    } finally {
      setIsOpen(false); // Fecha a modal
    }
  };

  // Renderiza os botões com base no status atual
  const renderButtons = () => {
    const isDisabled = status_atual !== 'analise';

    return (
      <div className="flex space-x-2">
        <Button
          onClick={() => openDialog('aprovada')}
          className="mb-2 flex items-center"
          size="sm"
          variant="solid"
          color="green-700"
          disabled={isDisabled}
        >
          <AiOutlineCheck className="mr-2" /> Aprovar Adesão
        </Button>
        <Button
          onClick={() => openDialog('recusada')}
          className="mb-2 flex items-center"
          size="sm"
          variant="solid"
          color="red-900"
          disabled={isDisabled}
        >
          <AiOutlineClose className="mr-2" /> Recusar Adesão
        </Button>
      </div>
    );
  };

  return (
    <div>
      {renderButtons()}

      {/* Modal para atualizar o status */}
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        width={500}
      >
        <h5 className="mb-4">{selectedStatus=="aprovada"?'Aprovar adesão':'Recusar adesão'}</h5>
        <Alert showIcon className="mb-4" type="info">
          Você está prestes a atualizar o status da adesão. Deseja adicionar uma mensagem?
        </Alert>

        {/* Formulário para enviar a mensagem opcional */}
        <Formik
          initialValues={{ message: '' }}
          validationSchema={statusUpdateSchema}
          onSubmit={handleStatusUpdate}
        >
          {({ errors, touched }) => (
            <Form>
              <FormContainer>
                <FormItem
                  label="Mensagem (opcional)"
                  invalid={errors.message && touched.message}
                  errorMessage={errors.message}
                >
                  <Field
                    textArea
                    name="message"
                    placeholder="Digite uma mensagem..."
                    component={Input}
                  />
                </FormItem>
                <FormItem>
                  <Button type="submit" variant="solid">
                    Confirmar
                  </Button>
                </FormItem>
              </FormContainer>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default StatusUpdateButton;
import { Container } from '@/components/shared';
import CursoForm from '@/components/template/curso/CursoNucleoForm';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', 
  },
  formContainer: {
    width: '50%',
  },
};

const CursoFormulario = () => {
  return (
    <div style={styles.container}>
      <Container style={styles.formContainer}>
        <CursoForm />
      </Container>
    </div>
  );
}

export default CursoFormulario;

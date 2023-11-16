import { Container } from '@/components/shared';
import CursoForm from '@/components/template/curso/CursoNucleoForm';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '40%',
    margin: '0 auto',
  },
};

const CursoFormulario = () => {
  return (
    <div style={styles.container}>
      <Container>
        <CursoForm />
      </Container>
    </div>
  );
}

export default CursoFormulario;
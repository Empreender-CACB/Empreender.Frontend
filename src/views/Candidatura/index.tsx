import { Container } from '@/components/shared';
import CursoForm from '@/components/template/curso/CursoForm';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', 
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

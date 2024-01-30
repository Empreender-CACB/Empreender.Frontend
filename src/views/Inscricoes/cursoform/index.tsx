import { Container } from '@/components/shared';
import CursoNucleoForm from '@/components/template/curso/CursoNucleoForm';

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

const CursoNucleoFormulario = () => {
  return (
    <div style={styles.container}>
      <Container>
        <CursoNucleoForm />
      </Container>
    </div>
  );
}

export default CursoNucleoFormulario;
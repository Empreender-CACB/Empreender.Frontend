import { Container } from '@/components/shared';
import CadastraEmpresa from '@/components/template/sebrae/CadastraEmpresa';

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

const CadastraEmpresaFormulario = () => {
  return (
    <div style={styles.container}>
      <Container>
        <CadastraEmpresa />
      </Container>
    </div>
  );
}

export default CadastraEmpresaFormulario;
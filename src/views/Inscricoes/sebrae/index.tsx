import { Container } from '@/components/shared';
import CadastraEmpresa from '@/components/template/sebrae/CadastraEmpresa';
import CadastraProposta from '@/components/template/sebrae/CadastraProposta';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    margin: '0 auto',
  },
};

const CadastraEmpresaFormulario = () => {
  return (
    <div style={styles.container}>
      {/* ?????? style direto? */}
      <style>
        {`
          @media (min-width: 768px) {
            #container {
              width: 40%; 
            }
          }
          @media (max-width: 767px) {
            #container {
              width: 100%;
            }
          }
        `}
      </style>
      <Container>
        <CadastraEmpresa />
      </Container>
    </div>
  );
}

export default CadastraEmpresaFormulario;

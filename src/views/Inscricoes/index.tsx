import { useState } from 'react'
import { AdaptableCard, Container } from '@/components/shared'
import Logo from '@/components/template/Logo'
import CursoForm from '@/components/template/curso/CursoForm'
import Button from '@/components/ui/Button'



const CursoFormulario = () => {
    const [showWelcome, setShowWelcome] = useState(true)
    const [showForm, setShowForm] = useState(false)

    const handleStartInscricaoClick = () => {
        setShowWelcome(false)
        setShowForm(true)
    }

    const styles = {
      container: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
      },
      contentContainer: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '800px',
          maxHeight: '800px',
          textAlign: 'center',
          padding: '20px',
      },
      logoContainer: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
          marginBottom: '20px',
      },
      buttonContainer: {
          marginTop: '20px', // Reduzido o espaço superior para dispositivos móveis
      },
      textContainer: {
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'center',
          width: '100%',
          textAlign: showForm ?'left' : 'center',
      },
      h2: {
          color: '#555', // Cor mais clara para o h2
          marginBottom: '8px',
      },
      h4: {
          color: '#888', // Cor mais fraca para o h4
      },
      separator: {
          borderBottom: '1px solid #dedede', // Linha separadora
          width: '100%',
          margin: '20px 0',
      },
  }

    return (
        <div style={styles.container}>
            <Container>
                <AdaptableCard className="max-w-4xl mx-auto">
                    <span>Portal do Empreender - V5</span>
                    <div style={styles.contentContainer}>
                        <div style={styles.logoContainer}>
                            <div
                                style={{ maxWidth: '150px', minWidth: '80px' }}
                            >
                                <Logo />
                            </div>
                            <div
                                style={{ maxWidth: '150px', minWidth: '80px' }}
                            >
                                <Logo logoPath="logo-empreender.png" />
                            </div>
                            <div
                                style={{ maxWidth: '150px', minWidth: '80px' }}
                            >
                                <Logo logoPath="al_invest_logo.jpg" />
                            </div>
                            <div
                                style={{ maxWidth: '100px', minWidth: '40px' }}
                            >
                                <Logo logoPath="sebrae.svg" />
                            </div>
                        </div>
                        <div
                            style={styles.textContainer}
                            className="text-container"
                        >
                            {showWelcome && (
                                <>
                                    <h2 style={styles.h2}>
                                        Bem-vindo ao processo de inscrição de
                                        consultores!
                                    </h2>
                                    <div style={styles.separator}></div>
                                    <h4 style={styles.h4}>
                                        Seja parte da nossa equipe!
                                        <br />
                                        Junte-se a nós como consultor e ajude a
                                        impulsionar o Empreender.
                                    </h4>
                                    <div style={styles.buttonContainer}>
                                        <Button
                                            variant="solid"
                                            onClick={handleStartInscricaoClick}
                                        >
                                            Iniciar Inscrição
                                        </Button>
                                    </div>
                                </>
                            )}
                            {showForm && <CursoForm />}
                        </div>
                    </div>
                </AdaptableCard>
            </Container>
        </div>
    )
}

export default CursoFormulario

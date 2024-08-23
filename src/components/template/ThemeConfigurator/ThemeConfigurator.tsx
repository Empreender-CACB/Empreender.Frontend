import ModeSwitcher from './ModeSwitcher'
import LayoutSwitcher from './LayoutSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
// import DirectionSwitcher from './DirectionSwitcher'
import NavModeSwitcher from './NavModeSwitcher'
// import CopyButton from './CopyButton'

export type ThemeConfiguratorProps = {
  callBackClose?: () => void
}

const ThemeConfigurator = ({ callBackClose }: ThemeConfiguratorProps) => {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-y-10 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h6>Modo noturno</h6>
            <span>Altere para modo noturno</span>
          </div>
          <ModeSwitcher />
        </div>
        {/* <div className="flex items-center justify-between">
          <div>
              <h6>Direção</h6>
              <span>Selecione a direção que barra de navegação estará.</span>
          </div>
          <DirectionSwitcher callBackClose={callBackClose} />
        </div> */}
        <div>
          <h6 className="mb-3">Tema aplicado</h6>
          <NavModeSwitcher />
        </div>
        <div>
          <h6 className="mb-3">Tema</h6>
          <ThemeSwitcher />
        </div>
        <div>
          <h6 className="mb-3">Layout</h6>
          <LayoutSwitcher />
        </div>
      </div>
      {/* <CopyButton /> */}
    </div>
  )
}

export default ThemeConfigurator

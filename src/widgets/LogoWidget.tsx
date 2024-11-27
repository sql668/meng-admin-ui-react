import { IconWidget } from "@form-created/react";
import LogoSvg from "../assets/aq2w1-rszas.svg"
export const LogoWidget: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
    <IconWidget
      infer={LogoSvg}
      style={{ height: 24, width: 'auto' }}
    />
  </div>
)
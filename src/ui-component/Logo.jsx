// material-ui
import { useTheme } from '@mui/material/styles';
import logo from '../assets/images/Logo/Logo.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return <img src={logo} alt="Logo Img" style={{ height: 40, width: 200, objectFit: 'contain' }} />;
};

export default Logo;

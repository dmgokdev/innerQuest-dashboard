import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useForm } from 'react-hook-form';
import { apiPost } from 'services/useAuth';
import apiurl from 'constant/apiurl';
import { setStorage } from 'services/storage';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const url = `${apiurl.API_URL}auth/login`;
      const params = { email: data.email, password: data.password, role: 1 };
      const response = await apiPost(url, params);
      if (response.success) {
        localStorage.setItem('token', response.payload.accessToken);
        setStorage('userInfo', response.payload.user);
        setIsLoading(false);
        navigate('/dashboard');
      } else {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign in with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <form noValidate onSubmit={handleSubmit(onSubmit)} {...others}>
        <FormControl fullWidth error={Boolean(errors.email)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-login"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: 'Must be a valid email'
              }
            })}
            label="Email Address / Username"
          />
          {errors.email && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {errors.email.message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth error={Boolean(errors.password)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-login"
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: 'Password is required' })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {errors.password && (
            <FormHelperText error id="standard-weight-helper-text-password-login">
              {errors.password.message}
            </FormHelperText>
          )}
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Button
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '20px',
              backgroundColor: '#14b8f0',
              color: '#fff'
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign in'}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AuthLogin;

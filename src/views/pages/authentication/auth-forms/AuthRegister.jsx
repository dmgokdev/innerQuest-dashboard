import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useForm } from 'react-hook-form';
import { apiPost } from 'services/useAuth';
import apiurl from 'constant/apiurl';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const url = `${apiurl.API_URL}auth/register`;
      const params = {
        name: data.name,
        email: data.email,
        password: data.password
      };

      const response = await apiPost(url, params);
      setIsLoading(false);
      navigate('/login');
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmShowPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} {...others}>
      <FormControl fullWidth error={Boolean(errors.name)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-register">Name</InputLabel>
        <OutlinedInput
          id="outlined-adornment-name-register"
          type="name"
          {...register('name', {
            required: 'Name is required'
          })}
        />
        {errors.name && (
          <FormHelperText error id="standard-weight-helper-text--register">
            {errors.name.message}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth error={Boolean(errors.email)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-register"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: 'Must be a valid email'
            }
          })}
        />
        {errors.email && (
          <FormHelperText error id="standard-weight-helper-text--register">
            {errors.email.message}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth error={Boolean(errors.password)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-register"
          type={showPassword ? 'text' : 'password'}
          {...register('password', { required: 'Password is required' })}
          onChange={(e) => changePassword(e.target.value)}
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
        />
        {errors.password && (
          <FormHelperText error id="standard-weight-helper-text-password-register">
            {errors.password.message}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth error={Boolean(errors.confirmPassword)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-confirm-password-register">Confirm Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-confirm-password-register"
          type={showConfirmPassword ? 'text' : 'password'}
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: (value) => value === watch('password') || 'Passwords do not match'
          })}
          onChange={(e) => changePassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleConfirmShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.confirmPassword && (
          <FormHelperText error id="standard-weight-helper-text-confirm-password-register">
            {errors.confirmPassword.message}
          </FormHelperText>
        )}
      </FormControl>

      {strength !== 0 && (
        <FormControl fullWidth>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" fontSize="0.75rem">
                  {level?.label}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </FormControl>
      )}

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
          {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign up'}
        </Button>
      </Box>
    </form>
  );
};

export default AuthRegister;

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, Modal, Paper, IconButton } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { getStorage } from 'services/storage';
import apiurl from 'constant/apiurl';
import { apiPost, apiPut } from 'services/useAuth';

const Settings = () => {
  const userInfo = getStorage('userInfo');
  const token = localStorage.getItem('token');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      email: '',
      newPassword: ''
    }
  });
  const {
    control: addControl,
    handleSubmit: handleAddSubmit,
    reset: addReset,
    formState: { errors: addErrors }
  } = useForm();

  useEffect(() => {
    if (userInfo) {
      setValue('name', userInfo.name || '');
      setValue('email', userInfo.email || '');
    }
  }, [userInfo, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const url = `${apiurl.API_URL}users/${userInfo?.id}`;
      const params = {
        name: data.name,
        email: data.email,
        password: data.password
      };

      const response = await apiPut(url, params, token);
      setIsLoading(false);
      localStorage.setItem('userInfo', JSON.stringify(response.payload));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddAdmin = async (data) => {
    try {
      setIsLoading(true);
      const url = `${apiurl.API_URL}auth/register`;
      const params = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: 1
      };

      const response = await apiPost(url, params, token);
      setIsLoading(false);
      setOpen(false);
      addReset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box
        sx={{
          backgroundColor: 'white',
          py: 2,
          px: 2,
          mb: 2,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h3">Admin Settings</Typography>
        <Button
          sx={{
            background: 'linear-gradient(to right, #39e89a, #19bee6)',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            borderRadius: '8px',
            '&:hover': { background: 'linear-gradient(to right, #19bee6, #39e89a)' }
          }}
          variant="contained"
          onClick={handleOpen}
        >
          Add New Admin
        </Button>
      </Box>
      <Paper sx={{ p: 4, borderRadius: '12px', boxShadow: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="Name" margin="normal" variant="outlined" />}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="Email" margin="normal" variant="outlined" />}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="New Password" type="password" margin="normal" variant="outlined" />
            )}
          />
          <Button
            sx={{
              mt: 2,
              background: 'linear-gradient(to right, #39e89a, #19bee6)',
              fontWeight: 'bold',
              px: 4,
              py: 1.2,
              width: 160,
              borderRadius: '8px',
              '&:hover': { background: 'linear-gradient(to right, #19bee6, #39e89a)' }
            }}
            type="submit"
            variant="contained"
            fullWidth
          >
            Save Changes
          </Button>
        </form>
      </Paper>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            p: 4,
            borderRadius: '12px',
            boxShadow: 5
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="modal-title" variant="h3" fontWeight="bold">
              Add New Admin
            </Typography>
            <IconButton onClick={handleClose}>
              <IconX size={24} color="red" />
            </IconButton>
          </Box>
          <form onSubmit={handleAddSubmit(onAddAdmin)}>
            <Controller
              name="name"
              control={addControl}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  error={!!addErrors.name}
                  helperText={addErrors.name?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={addControl}
              rules={{ required: 'Email is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  margin="normal"
                  variant="outlined"
                  error={!!addErrors.email}
                  helperText={addErrors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={addControl}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="New Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  error={!!addErrors.password}
                  helperText={addErrors.password?.message}
                />
              )}
            />
            <Button
              sx={{
                mt: 2,
                background: 'linear-gradient(to right, #39e89a, #19bee6)',
                fontWeight: 'bold',
                px: 3,
                py: 1.2,
                borderRadius: '8px',
                '&:hover': { background: 'linear-gradient(to right, #19bee6, #39e89a)' }
              }}
              type="submit"
              variant="contained"
              fullWidth
            >
              Add Admin
            </Button>
          </form>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Settings;

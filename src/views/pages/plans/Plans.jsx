import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  TextField,
  Tooltip
} from '@mui/material';
import apiurl from 'constant/apiurl';
import { apiDelete, apiGet, apiPost, apiPut } from 'services/useAuth';
import { useNavigate } from 'react-router-dom';
import { AddCircle, Edit } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Plans = () => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isLoading, setIsLoading] = useState(false);
  const [plansData, setPlansData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      deleteUser(selectedUserId);
      handleDialogClose();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setIsDialogOpen(true);
  };

  const getAllPlans = async () => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}plans`;
        const params = { page: page + 1, limit: pageSize };
        const response = await apiGet(URL, params, token);
        setPlansData(response.data.payload.records);
        setTotalCount(response.data.payload.totalRecords);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteUser = async (id) => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}plans/${id}`;
        await apiDelete(URL, token);
        getAllPlans();
      } catch (error) {
        console.error('Error Deleting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const URL = `${apiurl.API_URL}plans`;
      const params = {
        name: data.name,
        description: data.description,
        price: data.price
      };
      await apiPost(URL, params, token);
      setIsSubmitting(false);
      setIsModalOpen(false);
      reset();
      getAllPlans();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSinglePlan = async (id) => {
    setEditId(id);
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}plans/${id}`;
        const response = await apiGet(URL, {}, token);

        setPlanData({
          name: response.data.payload.name || '',
          description: response.data.payload.description || '',
          price: response.data.payload.price || ''
        });

        setIsEditOpen(true);
      } catch (error) {
        console.error('Error fetching plan:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const editSubmit = async (data) => {
    try {
      const URL = `${apiurl.API_URL}plans/${editId}`;
      const params = {
        name: data.name,
        description: data.description,
        price: data.price
      };
      await apiPut(URL, params, token);
      setIsSubmitting(false);
      setIsEditOpen(false);
      reset();
      getAllPlans();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getAllPlans();
  }, [page, pageSize]);

  useEffect(() => {
    reset(planData);
  }, [planData, reset]);

  return (
    <>
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
        <div>
          <Typography variant="h3">All Plans</Typography>
          <Typography variant="subtitle1" component="p">
            Manage all plans and their access rights here.
          </Typography>
        </div>
        {/* <div>
          <Button
            startIcon={<AddCircle />}
            variant="contained"
            color="primary"
            sx={{ width: 120, background: 'linear-gradient(to right, #39e89a, #19bee6)', fontWeight: 'bold' }}
            onClick={() => setIsModalOpen(true)}
          >
            Add Plan
          </Button>
        </div> */}
      </Box>

      <TableContainer component={Paper}>
        {isLoading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Plan ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              plansData?.length > 0 ? (
                plansData?.map((data) => (
                  <TableRow key={data.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" align="center">
                      {data?.id}
                    </TableCell>
                    <TableCell align="center">{data?.name}</TableCell>
                    <TableCell align="center">{data?.description}</TableCell>
                    <TableCell align="center">${data?.price}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 1.5
                        }}
                      >
                        <Tooltip title="Update Plan" arrow>
                          <IconButton
                            color="primary"
                            onClick={() => getSinglePlan(data.id)}
                            sx={{
                              backgroundColor: '#e3f2fd',
                              '&:hover': {
                                backgroundColor: '#bbdefb'
                              }
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Delete Plan" arrow>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(data.id)}
                            sx={{
                              backgroundColor: '#ffebee',
                              '&:hover': {
                                backgroundColor: '#ffcdd2'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(event, newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="add-plan-modal-title"
        aria-describedby="add-plan-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(to right, #39e89a, #19bee6)',
              borderRadius: '12px 12px 0 0',
              padding: '16px',
              textAlign: 'center',
              mb: 2
            }}
          >
            <Typography id="add-plan-modal-title" variant="h5" fontWeight="bold" color="white">
              Add New Plan
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              {...register('description', {
                required: 'Description is required'
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              {...register('price', {
                required: 'Price is required',
                valueAsNumber: true
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  reset();
                  setIsModalOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  borderColor: '#39e89a',
                  color: 'gray',
                  '&:hover': {
                    backgroundColor: '#ccf9e5',
                    borderColor: '#39e89a '
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #39e89a, #19bee6)',
                  color: 'white',
                  borderRadius: 2
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Plan'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Modal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        aria-labelledby="edit-plan-modal-title"
        aria-describedby="edit-plan-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(to right, #39e89a, #19bee6)',
              borderRadius: '12px 12px 0 0',
              padding: '16px',
              textAlign: 'center',
              mb: 2
            }}
          >
            <Typography id="edit-plan-modal-title" variant="h5" fontWeight="bold" color="white">
              Update Plan
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(editSubmit)} noValidate>
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              defaultValue={planData.name}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              defaultValue={planData.description}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              {...register('description', {
                required: 'Description is required'
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={planData.price}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              {...register('price', {
                required: 'Price is required',
                valueAsNumber: true
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  reset();
                  setIsEditOpen(false);
                  setPlanData({ name: '', description: '', price: '' });
                }}
                sx={{
                  borderRadius: 2,
                  borderColor: '#39e89a',
                  color: 'gray',
                  '&:hover': {
                    backgroundColor: '#ccf9e5',
                    borderColor: '#39e89a '
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #39e89a, #19bee6)',
                  color: 'white',
                  borderRadius: 2
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Update Plan'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        PaperProps={{
          style: {
            padding: '16px',
            borderRadius: '12px',
            maxWidth: '400px'
          }
        }}
      >
        <DialogTitle
          id="confirmation-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: 'rgba(0, 0, 0, 0.87)',
            textAlign: 'center'
          }}
        >
          <DeleteForeverIcon color="error" sx={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
          Delete Confirmation
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: 'center',
            padding: '8px 16px',
            marginTop: '-8px'
          }}
        >
          <DialogContentText
            id="confirmation-dialog-description"
            sx={{
              fontSize: '0.95rem',
              color: 'rgba(0, 0, 0, 0.6)'
            }}
          >
            Are you sure you want to delete this plan? <br /> This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 16px'
          }}
        >
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            color="primary"
            sx={{
              textTransform: 'none',
              padding: '6px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              padding: '6px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Plans;

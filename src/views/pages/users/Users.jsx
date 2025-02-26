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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  Tooltip
} from '@mui/material';
import apiurl from 'constant/apiurl';
import { apiDelete, apiGet, apiPut } from 'services/useAuth';
import { useNavigate } from 'react-router-dom';
import { PictureAsPdf } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Users = () => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [blockPageSize, setBlockPageSize] = useState(10);
  const [blockPage, setBlockPage] = useState(0);
  const [totalActiveCount, setTotalActiveCount] = useState(0);
  const [totalBlockCount, setTotalBlockCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [blockedUser, setBlockedUser] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogBlockOpen, setIsDialogBlockOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [userDetails, setUserDetails] = useState([]);

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setIsDialogOpen(true);
  };

  const handleBlockClick = (id) => {
    setSelectedUserId(id);
    setIsDialogBlockOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleDialogBlockClose = () => {
    setIsDialogBlockOpen(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      deleteUser(selectedUserId);
      handleDialogClose();
    }
  };

  const handleConfirmBlock = () => {
    if (selectedUserId) {
      blockUser(selectedUserId);
      handleDialogBlockClose();
    }
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    setUserDetails(null);
  };

  const getAllUsers = async () => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}users/?status=ACTIVE&sort=id:desc`;
        const params = { page: page + 1, limit: pageSize };
        const response = await apiGet(URL, params, token);
        setUsersData(response.data.payload.records);
        setTotalActiveCount(response.data.payload.totalRecords);
        setFilteredData(response.data.payload.records);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getAllBlockUser = async () => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}users/?status=BLOCKED`;
        const params = { page: blockPage + 1, limit: blockPageSize };
        const response = await apiGet(URL, params, token);
        setBlockedUser(response.data.payload.records);
        setTotalBlockCount(response.data.payload.totalRecords);
        setFilteredData(response.data.payload.records);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const blockUser = async (id) => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}users/${id}`;
        const params = { status: activeTab === 0 ? 'BLOCKED' : 'ACTIVE' };
        await apiPut(URL, params, token);

        if (activeTab === 0) {
          const user = usersData.find((u) => u.id === id);
          if (user) {
            setUsersData((prev) => (prev || []).filter((u) => u.id !== id));
            setBlockedUser((prev) => [...(prev || []), { ...user, status: 'BLOCKED' }]);
          }
        } else {
          const user = blockedUser.find((u) => u.id === id);
          if (user) {
            setBlockedUser((prev) => (prev || []).filter((u) => u.id !== id));
            setUsersData((prev) => [...(prev || []), { ...user, status: 'ACTIVE' }]);
          }
        }
      } catch (error) {
        console.error('Error blocking/unblocking user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteUser = async (id) => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}users/${id}`;
        await apiDelete(URL, token);
        getAllUsers();
      } catch (error) {
        console.error('Error Deleting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getUserDetail = async (id) => {
    setIsDetailLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}users/${id}`;
        const params = { page: page + 1, limit: pageSize };
        const response = await apiGet(URL, params, token);
        setUserDetails(response.data.payload);
        setIsSidebarOpen(true);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsDetailLoading(false);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    console.log(newValue);
    setPage(0);
  };

  useEffect(() => {
    if (activeTab === 0) {
      setFilteredData(usersData);
    } else {
      setFilteredData(blockedUser);
    }
  }, [activeTab, usersData, blockedUser]);

  useEffect(() => {
    getAllUsers();
    getAllBlockUser();
  }, [page, pageSize, blockPage, blockPageSize]);

  console.log(usersData);

  return (
    <>
      <Box sx={{ backgroundColor: 'white', py: 2, px: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="h3">All Users</Typography>
        <Typography variant="subtitle1" component="p">
          Manage all users and their access rights here.
        </Typography>
      </Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 2,
          backgroundColor: '#f7f9fc',
          borderRadius: '8px'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="User Tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#14b8f0',
              height: '4px'
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              color: '#6b7280',
              '&.Mui-selected': {
                color: '#14b8f0'
              }
            },
            '& .MuiTab-root:hover': {
              backgroundColor: '#eaf9ff'
            }
          }}
        >
          <Tab label="All Users" />
          <Tab label="Blocked Users" />
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        {isLoading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">User ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Plan</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              filteredData?.length > 0 ? (
                filteredData?.map((data) => (
                  <TableRow key={data.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{data?.id}</TableCell>
                    <TableCell align="center">{data?.name}</TableCell>
                    <TableCell align="center">{data?.email}</TableCell>
                    <TableCell align="center">{data?.plan}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 1.5
                        }}
                      >
                        <Tooltip title="View PDF's" arrow>
                          <IconButton
                            sx={{
                              backgroundColor: '#e3f2fd',
                              '&:hover': {
                                backgroundColor: '#bbdefb'
                              }
                            }}
                            onClick={() => getUserDetail(data.id)}
                          >
                            <PictureAsPdf sx={{ color: '#1976d2' }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={activeTab === 0 ? 'Block User' : 'Unblock User'} arrow>
                          <IconButton
                            sx={{
                              backgroundColor: activeTab === 0 ? '#ffebee' : '#e8f5e9',
                              '&:hover': {
                                backgroundColor: activeTab === 0 ? '#ffcdd2' : '#c8e6c9'
                              }
                            }}
                            onClick={() => handleBlockClick(data.id)}
                          >
                            <BlockIcon sx={{ color: activeTab === 0 ? '#d32f2f' : '#388e3c' }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete User" arrow>
                          <IconButton
                            sx={{
                              backgroundColor: '#ffebee',
                              '&:hover': {
                                backgroundColor: '#ffcdd2'
                              }
                            }}
                            onClick={() => handleDeleteClick(data.id)}
                          >
                            <DeleteIcon sx={{ color: '#d32f2f' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
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
        count={activeTab === 0 ? totalActiveCount : totalBlockCount}
        rowsPerPage={activeTab === 0 ? pageSize : blockPageSize}
        page={activeTab === 0 ? page : blockPage}
        onPageChange={(event, newPage) => {
          activeTab === 0 ? setPage(newPage) : setBlockPage(newPage);
        }}
        onRowsPerPageChange={(event) => {
          const newSize = parseInt(event.target.value, 10);
          if (activeTab === 0) {
            setPageSize(newSize);
            setPage(0);
          } else {
            setBlockPageSize(newSize);
            setBlockPage(0);
          }
        }}
      />
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
            Are you sure you want to delete this user? <br /> This action cannot be undone.
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
      <Dialog
        open={isDialogBlockOpen}
        onClose={handleDialogBlockClose}
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
          <BlockIcon color={activeTab === 0 ? 'error' : 'success'} sx={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
          {activeTab === 0 ? 'Block' : 'Unblock'} Confirmation
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
            Are you sure you want to {activeTab === 0 ? 'block' : 'unblock'} this user? <br />
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
            onClick={handleDialogBlockClose}
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
            onClick={handleConfirmBlock}
            variant="contained"
            sx={{
              textTransform: 'none',
              padding: '6px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: activeTab === 0 ? '#d32f2f' : '#2e7d32',
              '&:hover': {
                backgroundColor: activeTab === 0 ? '#b71c1c' : '#1b5e20'
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={handleSidebarClose}
        PaperProps={{
          sx: { width: 400 }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            {userDetails?.user_answers_logs?.some((log) => log?.bussiness_idea?.length > 0) ? 'Generated PDFs' : 'No PDFs Generated'}
          </Typography>

          {userDetails ? (
            <Box>
              {userDetails?.user_answers_logs?.length > 0 ? (
                userDetails?.user_answers_logs?.map((log, logIndex) => (
                  <Box key={logIndex} sx={{ mb: 3 }}>
                    <Typography variant="h4" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {`Business Idea Generation ${logIndex + 1}`}
                    </Typography>
                    {log?.bussiness_idea?.length > 0 ? (
                      log?.bussiness_idea?.map((pdf, index) =>
                        pdf?.pdf_path ? (
                          <Box
                            key={`${logIndex}-${index}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                              p: 1.5,
                              borderRadius: '8px',
                              backgroundColor: '#f9f9f9',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#f1f1f1'
                              }
                            }}
                            onClick={() => window.open(`${apiurl.Image_URL}${pdf.pdf_path}`, '_blank')}
                          >
                            <PictureAsPdf
                              style={{
                                width: '24px',
                                height: '24px',
                                marginRight: '10px',
                                color: '#f44336'
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                fontSize: '14px',
                                fontWeight: 'medium',
                                color: 'text.primary'
                              }}
                            >
                              {`PDF ${index + 1}`}
                            </Typography>
                          </Box>
                        ) : null
                      )
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        No PDFs Available
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                  No Business Ideas Available
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No user selected.
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Users;

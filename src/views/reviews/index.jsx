import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import { CheckCircle, Close } from '@mui/icons-material';
import apiurl from 'constant/apiurl';
import { apiGet, apiPut } from '../../services/useAuth';

const Reviews = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(null); // Tracks loading for Approve buttons
  const [declineLoading, setDeclineLoading] = useState(null); // Tracks loading for Decline buttons
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const token = localStorage.getItem('token');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const URL = `${apiurl.API_URL}review`;
      const params = {
        page: page + 1,
        limit: pageSize
      };
      const response = await apiGet(URL, params, token);
      setData(response.data.payload.records);
      setTotalCount(response.data.payload.totalRecords);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (status, id, isApprove) => {
    if (isApprove)
      setApproveLoading(id); // Set loading for Approve button
    else setDeclineLoading(id); // Set loading for Decline button

    try {
      const URL = `${apiurl.API_URL}review/${id}`;
      const params = { approved: status };
      const response = await apiPut(URL, params, token);
      if (response.success === true) {
        getData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isApprove)
        setApproveLoading(null); // Reset Approve button loading
      else setDeclineLoading(null); // Reset Decline button loading
    }
  };

  useEffect(() => {
    getData();
  }, [page, pageSize]);

  return (
    <div>
      <TableContainer component={Paper}>
        {loading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">User</TableCell>
              <TableCell align="left">Reviews</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((item, key) => (
                <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">
                    <Box sx={{ display: 'flex' }}>
                      <img
                        src={item?.user?.image ? apiurl.Image_URL + item?.user?.image : 'https://placehold.co/600x400'}
                        style={{
                          alignSelf: 'center',
                          marginRight: '10px',
                          borderRadius: '100px',
                          height: '30px',
                          width: '30px',
                          objectFit: 'cover'
                        }}
                      />
                      <p>{item?.user?.name}</p>
                    </Box>
                  </TableCell>
                  <TableCell align="left" style={{ wordBreak: 'break-all', width: '400px' }}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: isExpanded ? item.comment : `${item.comment.substring(0, 200)}${item.comment.length > 200 ? '...' : ''}`
                      }}
                    />
                    {item.comment.length > 200 && (
                      <Button onClick={toggleContent} style={{ cursor: 'pointer' }}>
                        {isExpanded ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{item.approved === true ? 'Approved' : 'Declined'}</TableCell>
                  <TableCell align="left">
                    <Button
                      onClick={() => updateReview(true, item.id, true)}
                      startIcon={approveLoading === item.id ? <CircularProgress size={20} /> : <CheckCircle />}
                      variant="contained"
                      disabled={approveLoading === item.id || declineLoading === item.id} // Disable if any button is loading
                    >
                      Approve
                    </Button>{' '}
                    &nbsp;
                    <Button
                      onClick={() => updateReview(false, item.id, false)}
                      startIcon={declineLoading === item.id ? <CircularProgress size={20} /> : <Close />}
                      variant="contained"
                      color="error"
                      disabled={declineLoading === item.id || approveLoading === item.id} // Disable if any button is loading
                    >
                      Decline
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
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
          setLoading(true);
        }}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 5));
          setPage(0);
          setLoading(true);
        }}
      />
    </div>
  );
};

export default Reviews;

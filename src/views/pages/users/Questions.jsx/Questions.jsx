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
import apiurl from 'constant/apiurl';
import { apiGet, apiPost } from 'services/useAuth';
import { Box, MenuItem, Select } from '@mui/material';

const Questions = () => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isLoading, setIsLoading] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const getAllQuestions = async () => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}questions`;
        const params = {
          page: page + 1,
          limit: pageSize
        };
        const response = await apiGet(URL, params, token);
        setQuestionsData(response.data.payload.records);
        setTotalCount(response.data.payload.totalRecords);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getAllQuestions();
  }, [page, pageSize]);

  return (
    <>
      <Box sx={{ backgroundColor: 'white', py: 2, px: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="h3">Question & Answers</Typography>
      </Box>
      <TableContainer component={Paper}>
        {isLoading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="questions table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Question Id</TableCell>
              <TableCell align="center">Step Name</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionsData.length > 0 ? (
              questionsData.map((data) => (
                <TableRow key={data?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{data.id}</TableCell>
                  <TableCell align="center">{data.steps?.name}</TableCell>
                  <TableCell align="center">{data?.title}</TableCell>
                  <TableCell align="center">
                    {data?.user_answers?.length > 0 ? (
                      <Select
                        value={data.user_answers[0]}
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: '#f9f9f9',
                          borderRadius: '8px',
                          '& .MuiSelect-select': {
                            padding: '8px'
                          }
                        }}
                      >
                        {data.user_answers.map((answer, index) => (
                          <MenuItem key={index} value={answer}>
                            {answer.answer}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No answers available
                      </Typography>
                    )}
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
        }}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
};

export default Questions;

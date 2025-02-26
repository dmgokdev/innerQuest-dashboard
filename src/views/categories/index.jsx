import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid } from '@mui/x-data-grid';
import apiurl from 'constant/apiurl';
import { apiDelete, apiGet, apiPost, apiPut } from "../../services/useAuth";
import { useForm } from "react-hook-form";


const Categories = () => {
    const [getLoading, setGetLoading] = useState();
    const [APIdata, setAPIdata] = useState([]);
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [getSingle, setGetSingle] = useState();
    const [deleteLoading, setDeleteLoading] = useState();
    const [pageSize, setPageSize] = useState(5); 
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const {
        register: editRegister,
        handleSubmit: editHandleSubmit,
        formState: { errors: editError },
        reset: editReset,
        setValue: editSetValue,
    } = useForm();

    const addCategory = async (addata) => {
        setIsLoading(true);
        try {
            const url = `${apiurl.API_URL}category`;
            const params = {
                name: addata.name,
                description: addata.description
            };
            const response = await apiPost(url, params, token);
            if (response.success) {
                getData();
                setIsOpenModal(false);
                setAPIdata(response.addata.payload.records);
                reset();
            }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
    };

    const getData = async () => {
        setGetLoading(true);
        try {
            const URL = `${apiurl.API_URL}category?page=${page + 1}&limit=${pageSize}`;
            const params = {};
            const response = await apiGet(URL, params, token);
            //console.log(JSON.stringify(response));   
            setAPIdata(response.data.payload.records);
            setTotalCount(response.data.payload.totalRecords);
        } catch (error) {
            setGetLoading(false);
        } finally {
            setGetLoading(false);
        }
    };
    
    const editCategory = async (edata) => {
        if (!getSingle) return; 
        const url = `${apiurl.API_URL}category/${getSingle.id}`;
        try {
            setIsEditModal(true);
            setIsLoading(true);
            const params = {
                id: edata.editid,
                name: edata.editname,
                description: edata.editdescription
            };
            const response = await apiPut(url, params, token);
            if (response.success) {
                setIsEditModal(false);
                getData();
                reset();
            }
        } catch (error) {
            console.error("Error editing distributor:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFunction = async (id) => {
        if (!token) {
          return;
        }
        try {
          setDeleteLoading(id);
          const url = `${apiurl.API_URL}category/${id}`;
          const response = await apiDelete(url, token);
          getData();
        } catch (error) {
          console.error("Error deleting user:", error);
        } finally {
          setDeleteLoading(false);
        }
    };

    useEffect(() => {
        if (getSingle) {
            editSetValue("editid", getSingle.id);
            editSetValue("editname", getSingle.name);
            editSetValue("editdescription", getSingle.description);
        }
    }, [getSingle, editCategory]);

    useEffect(() => {
        getData();
        editCategory();
        addCategory();
    }, []);

    useEffect(() => {
        getData();
    }, [page, pageSize]);
    
    return(
        <>
            <Typography align="right" sx={{ mb: '15px' }}>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => { reset(); setIsOpenModal(true); }}>Add Category</Button>
            </Typography>
            <TableContainer component={Paper}>
                {getLoading && <LinearProgress />}
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Short Description</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {APIdata.length > 0 ? (
                            APIdata.map((data) => (
                                <TableRow key={data?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{data?.id}</TableCell>
                                    <TableCell align="left">{data?.name}</TableCell>
                                    <TableCell align="left">{data?.description && data?.description?.length > 50 ? `${data?.description?.substring(0, 50)}...` : data?.description || 'No description'}</TableCell>
                                    <TableCell align="left">
                                        <IconButton aria-label="Edit" color="primary" onClick={() => {
                                                setGetSingle(data);
                                                reset();
                                                setIsEditModal(true);
                                            }}>
                                                <EditIcon />
                                            </IconButton> | <IconButton color="error" onClick={() => deleteFunction(data?.id)}><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No data found</TableCell>
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
                    setGetLoading(true);
                }} 
                onRowsPerPageChange={(event) => {
                    setPageSize(parseInt(event.target.value, 5));
                    setPage(0);
                    setGetLoading(true);
                }}
            />    
            
            {isOpenModal && (
                <div className="createformsec">
                    <button type="button" className="text-gray-400 hover:text-gray-900 text-4xl" onClick={() => setIsOpenModal(false)}>&times;</button>

                    <form onSubmit={handleSubmit(addCategory)}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">Restaurant Name</label>
                            <input {...register("name", { required: true })} type="text" id="name" className="inputStyle" placeholder="John" />
                            {editError.editname && <span className="text-red-500">Name is required</span>}
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-black">Description</label>
                            <input {...register("description", { required: true })} type="text" id="description" className="inputStyle" placeholder="Description" />
                            {editError.editdescription && <span className="text-red-500">Description is required</span>}
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </div>
            )}


            {isEditModal && (
                <div className="editformsec">
                    <button type="button" className="text-gray-400 hover:text-gray-900 text-4xl" onClick={() => setIsEditModal(false)}>&times;</button>

                    <form onSubmit={editHandleSubmit(editCategory)}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">Restaurant Name</label>
                            <input {...editRegister("editname", { required: true })} defaultValue={getSingle.name ? getSingle.name : ""} type="text" id="name" className="inputStyle" placeholder="John" />
                            {editError.editname && <span className="text-red-500">Name is required</span>}
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-black">Description</label>
                            <input {...editRegister("editdescription", { required: true })} defaultValue={getSingle.description ? getSingle.description : ""} type="text" id="description" className="inputStyle" placeholder="Description" />
                            {editError.editdescription && <span className="text-red-500">Description is required</span>}
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </div>
            )}
        </>                
    );
}    
  
export default Categories;
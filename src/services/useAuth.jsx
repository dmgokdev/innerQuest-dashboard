import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export async function apiPost(url, params, token) {
  try {
    const isFormData = params instanceof FormData;
    const config = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(url, params, config);

    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }

    return response.data;
  } catch (error) {
    let errorMessage = 'Network error';

    if (error.response) {
      if (error.response.data.errors && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0].message || 'Network error';
      } else {
        errorMessage = error.response.data.message || 'Network error';
      }
    } else if (error.request) {
      errorMessage = 'Server is down or network is unreachable';
    }

    toast.error(errorMessage);

    return {
      success: false,
      message: errorMessage
    };
  }
}

export const apiDelete = async (url, token) => {
  if (!token) {
    toast.error('Authorization token is missing.');
    return { success: false, message: 'Authorization token is required.' };
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.delete(url, config);
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    return response;
  } catch (error) {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      const errorMessage = error.response.data.errors[0].message || 'Network error';
      toast.error(errorMessage);
    } else {
      const errorMessage = error.response.data.message || 'Network error';
      toast.error(errorMessage);
    }
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const apiGet = async (url, params = {}, token) => {
  try {
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.success) {
      return { success: true, data: response.data };
    } else {
      toast.error(response.data.message || 'Request failed.');
      return { success: false, message: response.data.message || 'Request failed.' };
    }
  } catch (error) {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      const errorMessage = error.response.data.errors[0].message || 'Network error';
      toast.error(errorMessage);
    } else {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || 'Network error';
      if (status === 401) {
        toast.error('Session expired. Redirecting to login...');
        window.location.href = '/login';
        localStorage.removeItem('token');
      }
      if (status !== 404) {
        toast.error(errorMessage);
      }
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

export async function apiPut(url, data = {}, token) {
  try {
    const isFormData = data instanceof FormData;
    const config = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.put(url, data, config);

    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      const errorMessage = error.response.data.errors[0].message || 'Network error';
      toast.error(errorMessage);
    } else {
      const errorMessage = error.response?.data?.message || 'Network error';
      toast.error(errorMessage);
    }
    return {
      success: false,
      message: errorMessage
    };
  }
}

export default {
  apiPost,
  apiDelete,
  apiGet,
  apiPut
};

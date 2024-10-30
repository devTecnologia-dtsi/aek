import axios from "axios";

export const fetchData = async ({ url, headers }) => {
    try {
        console.log(headers)
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const postData = async ({ url, body = '', headers = {} }) => {
    try {
        const response = await axios.post(url, body, headers);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const transformData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(name => {
        formData.append([name], data[name]);
    });
    return formData;
}
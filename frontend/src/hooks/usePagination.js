import { useEffect, useMemo, useState } from 'react';

const usePagination = (url,pageLimit=10,method = 'GET',body = null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [paginatedData, setPaginatedData] = useState([]);

    const getData = async (page) => {
        const options = {
            method:method,
            headers:{
                'Content-Type':'application/json'
            },
            body:body && JSON.stringify(body),
            credentials:'include'
        };
        try {
            setIsLoading(true);
        const res = await fetch(`${url}?page=${page}&limit=${pageLimit}`,options);
        const data = await res.json();
        if (res.status === 200) {
            return data;
        }else throw new Error('pagination error');
        } catch (err) {
            // console.log('an error in getting paginated data');
            return null;
        }finally{
            setIsLoading(false);
        }
    }

    const getTotalDataLength = useMemo(async () => {
        const options = {
            method:method,
            headers:{
                'Content-Type':'application/json'
            },
            body:body && JSON.stringify(body),
            credentials:'include'
        };
        const res = await fetch(url+'/total',options);
        const data = await res.json();
        if(res.status === 200) setTotalPages(Math.ceil(data.data/pageLimit));
        else return setTotalPages(0);
    },[]);

    const nextPage = () => {
        if (page < totalPages) {
            setPage(p => p+1);
        }
    }

    const previousPage = () => {
        if (page > 1) {
            setPage(p => p-1);
        }
    }

    const particularPage = (val) => {
        if (1 <= val && val <= totalPages) {
            setPage(val);
        }
    }

    useEffect(() => {
        getData(page).then(response => {
            if (response !== null) {
                setPaginatedData(response.data);
                // console.log(response);
            }
        });
    },[page]);

    return { page,totalPages,isLoading,paginatedData,nextPage,previousPage,particularPage };
}

export default usePagination;
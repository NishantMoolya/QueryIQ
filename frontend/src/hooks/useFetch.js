const useFetch = () => {
    return async (url,method = 'GET',postData=null,validStatus = 200) => {
        try {
            let options = {
                method:method,
                headers:{
                    'Content-Type':'application/json'
                },
                credentials:'include'
            };
            if (postData === null) {
                postData={message:'body is empty'};
            }
            if (method !== 'GET') {
                options = {...options,body:JSON.stringify(postData)};                
            }
            const res = await fetch(url,options);
            let data = await res.json();
            if (res.status === validStatus) {
                data.status = res.status;
                return data;
            }else{
                throw new Error('Invalid status code and response');
            }
        } catch (err) {
            // console.log(`fetch:an error occurred in getting data:${err}`);
            return null;
        }
    }
}

export default useFetch;
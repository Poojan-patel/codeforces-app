const fetchAPI = window.fetch;

window.fetch = async (uri,options)=>{
    //console.log("Called with these args",uri, options);
    const resp = await fetchAPI(uri,options);
    
    // resp.clone().json().then(body=>{
    //     console.log("Intercepted Body:",body)
    // });
    
        resp.clone().json().then(body=>{
            if(body.initialToken){
                window.localStorage.setItem('CodeforcesMiniAppAuthToken',body.initialToken);
            }
        })
    return resp;
}
console.log("Interceptor loaded successfully");
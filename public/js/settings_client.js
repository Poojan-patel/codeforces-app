const newName = document.querySelector('.values > .name > input');
const oldEmail = document.querySelector('.values > .email');
const newmobile = document.querySelector('.values > .mobile > input');
const confirmPass = document.querySelector('.values > .cpassword > input');
const newPass  = document.querySelector('.values > .npassword > input');
const updateForm = document.querySelector('form');

(async ()=>{
    await fetch("/authenticate",{
        method: "POST",
        headers:{
            'CodeforcesMiniAppAuthToken': window.localStorage.getItem('CodeforcesMiniAppAuthToken'),
            'Content-type': 'application/json'
        }
    }).then(response=>response.json()).then(data=>{
        if(!data.isLogged){
            return window.alert("You must be logged in to see the page");
        }
        oldEmail.textContent = data.user.email;
        newName.value = data.user.name;
        newmobile.value = (data.user.mobile)?data.user.mobile :"";
    })
})();

updateForm.addEventListener('submit',async (eve)=>{
    eve.preventDefault();
    //console.log(confirmPass.value, newPass.value)
    if(confirmPass.value !== newPass.value){
        return window.alert("Passwords not matching");
    }
    //console.log(newmobile.value)
    if(isNaN(Number(newmobile.value)) || newmobile.value.search('[\.-]') !== -1 || newmobile.value.length !== 10)
        return window.alert("Mobile Number Not Valid");
    if(newName.value.length === 0 || newName.value.search('[a-zA-Z]') === -1)
        return window.alert('Name Not Valid')
    
    queryString = {}
    queryString['name'] = newName.value;
    queryString['mobile'] = Number(newmobile.value);
    if(confirmPass.value)
        queryString['password'] = newPass.value;
    
    await fetch("/settings",{
        method: "POST",
        headers:{
            'CodeforcesMiniAppAuthToken': window.localStorage.getItem('CodeforcesMiniAppAuthToken'),
            'Content-type': 'application/json'
        },
        body: JSON.stringify(queryString)
    }).then(response=>response.json()).then(data=>{
        if(data.updated){
            window.alert("Updation Successful");
            return window.location.reload()
        }
        else{
            window.alert("Updation Unsuccessful");
            return window.location.reload()
        }
    })
    
})
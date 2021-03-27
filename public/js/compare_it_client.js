console.log("script loaded Successfully")
const Form = document.querySelector(".compare-handles")
const Add = document.querySelector(".plus-button")
const Handles = document.querySelector(".get-handles")
const Submit = document.querySelector(".compare-handles > input")
const DataOfHandles = document.querySelector(".handles-comparison-data")
const mainDisp = document.querySelector(".main-content-compare")
const errorDisp = document.querySelector(".handles-comparison-data p")

var count = 1
const add_handles = (e)=>{
    count++;
    if(count > 4)
        return
    e.preventDefault();
    var newHandle = Handles.lastChild.cloneNode(false);
    
    newHandle.name = "handle"+count;
    newHandle.value = "";
    Handles.appendChild(newHandle);
    if(count == 4)
        Add.style.display = 'none'
}

const emptyHandle = (err)=>{
    DataOfHandles.textContent = '';
    errorDisp.innerHTML = err;
    errorDisp.style.display = 'block';
    DataOfHandles.appendChild(errorDisp)
    Submit.disabled = false;
}

const showData = (data)=>{
    DataOfHandles.textContent = '';
    const table = document.createElement('table')
    const keys = Object.keys(data).splice(1);
    var th = document.createElement('tr')
    var td = document.createElement('td')
    td.textContent = 'handle';
    td.id = "table-header";
    th.appendChild(td)
    data['handle'].forEach(val=>{
        var td = document.createElement('td');
        td.textContent = val;
        td.id = "table-header";
        th.appendChild(td);
    }) 
    table.appendChild(th)
    keys.forEach(ele=>{
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        td.textContent = ele
        tr.appendChild(td)
        if(ele === 'titlePhoto'){
            data[ele].forEach(val=>{
                var td = document.createElement('td')
                if(val.search('-') !== -1){
                    td.textContent = '-'
                }
                else{
                    var img = document.createElement('img')
                    img.src = val
                    img.alt = '-'
                    td.appendChild(img)
                }
                tr.appendChild(td)
            })
        }
        else{
            data[ele].forEach(val=>{
                if(!val)
                    val = '-'
                var td = document.createElement('td')
                td.textContent = val
                tr.appendChild(td)
            })
        }
        table.appendChild(tr)
    })
    DataOfHandles.appendChild(table)
}

Form.addEventListener('submit',(e)=>{
    errorDisp.style.display= 'none';
    mainDisp.style.backgroundColor = 'black';
    Submit.disabled = true;
    e.preventDefault();
    var child = Handles.children;
    var queryString = {}
    for(var i = 0; i < child.length; i++){
        var hndle = child[i].value;
        if(!hndle)
            return emptyHandle("Empty Handle");
        if(hndle.search(/\W/) !== -1)
            return emptyHandle("Invalid Handle: "+hndle);
        queryString[child[i].name] = hndle;
    }
    fetch("/getinfo",{
        method: "POST",
        body: JSON.stringify(queryString), // Adding body or contents to send
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        } // Adding headers to the request
    }).then(respone=>{
        respone.json().then(data=>{
            Submit.disabled = false;
            if(data.error)
                return emptyHandle(data.error)
            return showData(data)
        })
    })
})
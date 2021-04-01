console.log("script loaded Successfully");
const Form = document.querySelector(".get-problems-form");
const tags = document.querySelector(".get-problems-form input")
const Table = document.querySelector(".main-content-problems table")
const errorP = document.querySelector(".main-content-problems p")
const mainDiv = document.querySelector(".main-content-problems")
const regex = RegExp('[a-zA-Z]');

Form.addEventListener('submit',(e)=>{
    e.preventDefault();
    errorP.style.display = 'none';
        Table.style.display = 'none';
        errorP.innerHTML = '';
        Table.innerHTML = '';
    if(regex.test(tags.value) == false){
        errorP.style.display = 'block';
        return errorP.innerHTML = 'Please Provide tag(s)';
    }
    var tagValue = tags.value.toLowerCase();
    const difficulty = parseInt(tagValue.match(/[0-9]+/));
    tagValue = tagValue.replace(/^[;]+|[ ]*/g, '')
    tagValue = tagValue.replace(/[;]+/,';')
    tagValue = tagValue.replace(/;[0-9]+|[0-9]+;/g, '')
    tagValue = tagValue.replace(/[^0-9a-z;-]/g, '')
    
    fetch('/fetchproblems?tags='+tagValue).then((response)=>{
        mainDiv.style.backgroundColor = "rgba(0,0,0,1)"
        response.json().then((data)=>{
            if(data.err){
                errorP.style.display = 'block';
                return errorP.innerHTML = data.err;
            }
            else{
                Table.style.display = 'block';
                Table.style.color = 'white';
                const probs = data.problems;
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.innerHTML = 'Contest'
                tr.appendChild(th);
                th = document.createElement('th');
                th.innerHTML = 'Index'
                tr.appendChild(th);
                th = document.createElement('th');
                th.innerHTML = 'Problem Name'
                tr.appendChild(th);
                th = document.createElement('th');
                th.innerHTML = 'Rating'
                tr.appendChild(th);
                Table.appendChild(tr);
                probs.forEach(ele=>{
                    if(difficulty !== NaN && ele.rating > difficulty)
                        return;
                    tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.innerHTML = ele.contestId
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerHTML = ele.index
                    tr.appendChild(td);
                    td = document.createElement('a');
                    td.innerHTML = ele.name
                    td.href = "https://codeforces.com/contest/" + ele.contestId +"/problem/" + ele.index;
                    td.target = "_blank"
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerHTML = ele.rating
                    td.style.width = '5vw'
                    tr.appendChild(td);
                    Table.appendChild(tr);
                });
                return;
            }
        })
        
    })
})
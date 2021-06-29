console.log("script loaded Successfully");
const Form = document.querySelector(".get-problems-form");
const Diff = document.querySelectorAll(".get-problems-form input")
const TagDiv = document.querySelector(".found-tags")
const Tag = document.querySelector(".tag-value")
const Selection = document.querySelector(".get-problems-form select")
const Table = document.querySelector(".main-content-problems table")
const errorP = document.querySelector(".main-content-problems p")
const mainDiv = document.querySelector(".main-content-problems")
const regex = RegExp('[a-zA-Z]');

const found_tags = new Set();

const add_tag = (e) =>{
    e.preventDefault();
    if(found_tags.has(Selection.value) || Selection.value === ""){
        return;
    }
    found_tags.add(Selection.value)
    const newTag = Tag.cloneNode(false)
    newTag.setAttribute('data-tag',Selection.value)
    newTag.innerHTML = Selection.value+'  &times;'
    newTag.style.display = 'block';
    newTag.style.width = 'max-content';
    TagDiv.appendChild(newTag)
    //console.log(Selection.value)
    //console.log(newTag, newTag.getAttribute('data-tag'))
}

const remove_me = (e,tag_name)=>{
    e.preventDefault();
    found_tags.delete(tag_name.getAttribute('data-tag'))
    tag_name.parentNode.removeChild(tag_name)
}

Form.addEventListener('submit',(e)=>{
    //console.log(Diff[0].value, Diff[1].value)
    e.preventDefault();
    errorP.style.display = 'none';
    Table.style.display = 'none';
    errorP.innerHTML = '';
    Table.innerHTML = '';
    TagDiv.innerHTML = '';
    // if(regex.test(tags.value) == false){
    //     errorP.style.display = 'block';
    //     return errorP.innerHTML = 'Please Provide tag(s)';
    // }
    // var tagValue = tags.value.toLowerCase();
    // const difficulty = parseInt(tagValue.match(/[0-9]+/));
    // tagValue = tagValue.replace(/^[;]+|[ ]*/g, '')
    // tagValue = tagValue.replace(/[;]+/,';')
    // tagValue = tagValue.replace(/;[0-9]+|[0-9]+;/g, '')
    // tagValue = tagValue.replace(/[^0-9a-z;-]/g, '')

    var tagValue = ""
    var minDifficulty = Diff[0].value;
    var maxDifficulty = Diff[1].value;
    if(/^\d+$/.test(minDifficulty) == false){
        minDifficulty = 0;
    }
    if(/^\d+$/.test(maxDifficulty) == false){
        maxDifficulty = 4000;
    }
    if(minDifficulty > maxDifficulty){
        [minDifficulty, maxDifficulty] = [maxDifficulty, minDifficulty]
    }

    found_tags.forEach(ele=>{
        tagValue += (ele+';')
        found_tags.delete(ele)
    })

    if(tagValue === ""){
        errorP.style.display = 'block';
        return errorP.innerHTML = 'Please Provide tag(s)';
    }
    
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
                    if(ele.rating < minDifficulty | ele.rating > maxDifficulty)
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
document.querySelector('.enterGame').addEventListener('click',(event)=>{
    event.preventDefault();

    const nickName = document.querySelector('.nickname>input').value;
    const gameName = document.querySelector('.gateway>input').value;
    
    fetch('/api/connectToGame',{
        method:'POST',
        body: JSON.stringify({gameName:gameName, user:{userName:nickName}}),
        headers:{ 'Content-Type': 'application/json;charset=utf-8'}
    })
    .then(resp => resp.json() )
    .then(resp => {
        console.log(resp)
        if(resp.message === 'OK'){
            window.location = '/'+resp.gameName+'?nickName='+resp.nickName;
        }else{
            alert(resp.message)
        }
    })

})
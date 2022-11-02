
document.getElementById('confirm').addEventListener('onkeyup', check)
document.getElementById('message').style.display ='none'
var check = function(){

    let password = document.getElementById('password').value
    let confirm = document.getElementById('confirm').value
    document.getElementById('message').style.display ='none'
    
    console.log(password , confirm)
    
    if(document.getElementById('password').value == document.getElementById('confirm').value){
        document.getElementById('message').style.display ='block'
       document.getElementById('message').innerHTML ="password matched"
         document.getElementById('message').style.backgroundColor='green'
         document.getElementById('message').style.color='white'
       document.getElementById('submit').disabled = false
       
       
      
    }else{
        document.getElementById('message').innerHTML ="password does not match"
        document.getElementById('message').style.backgroundColor='red'
        document.getElementById('message').style.color='white'
        document.getElementById('message').style.display ='block'
    
        document.getElementById('submit').disabled = true
    }
    }

   
   
    document.getElementById('password').addEventListener('onkeyup', pass)

    var pass = function(){
        let password = document.getElementById('password').value
        document.getElementById('passLength').style.display ='none'

        if(password.length > 4){
            console.log('password accepted')
            document.getElementById('passLength').style.display ='none'
            document.getElementById('submit').disabled = false
            


        }else{
            document.getElementById('passLength').innerHTML = 'password must be up to 5'
            document.getElementById('passLength').style.display ="block"
            document.getElementById('passLength').style.backgroundColor ='red'
            document.getElementById('submit').disabled = true
        }
    }


  




$(document).ready(function(){
    $("#sticker").sticky({topSpacing:0, widthFromWrapper:true, zIndex:24});
    $('#sticker').on('sticky-start', ()=>{
        $('#sticker').css({'background':'#134E5E', "padding":"5px auto"});
        $('#sticker .logo h3 span:nth-child(2)').css('color','white','');
        $('#sticker .menu-bar i').css('color', "white")
    })
    $('#sticker').on('sticky-end', ()=>{
        $('#sticker .menu-bar i').css('color', "")
        $('#sticker').css('background','transparent');
        $('#sticker .logo h3 span:nth-child(2)').css('color','whitesmoke')
    })
    $('.menu-bar').click(()=>{
       document.querySelector('.menu').classList.toggle('hide');
       $('body').toggleClass('hide')
        if(document.querySelector('.menu-bar i').className === 'ri-menu-line'){
            document.querySelector('.menu-bar i').className = 'ri-close-line';
            document.querySelector('.menu-bar i').style.color="white";
        }
        else{
           document.querySelector('.menu-bar i').className ="ri-menu-line";
           document.querySelector('.menu-bar i').style.color='white';
        }
    })
  });



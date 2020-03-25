
var modalToggler = document.querySelectorAll('[data-toggle="modal"]');
var modals = document.querySelectorAll('.qz_modal_container');

modalToggler.forEach(elem=>{
    elem.addEventListener('click', openModal);
});

modals.forEach(elem=>{
    elem.addEventListener('click', e=>{
        toggleModal(e.target.id);
    });
});

function openModal(e){
    var elem = e.target;
    while(elem.dataset.target == undefined){
        elem = elem.parentNode
    }
    toggleModal(elem.dataset.target);
}

function toggleModal(modalID){
    var elem = document.getElementById(modalID);
    if(elem == null || elem == undefined){
        return;
    }
    if(elem.style.display == ''){
        document.getElementById(modalID).style.display='block';
    }
    else{
        document.getElementById(modalID).style.display='';
    }
}


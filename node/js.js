
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// dieu huong web
const narbar=$(".narbar")
const control__info=$(".narbar__link-control--info")
const control__home=$(".narbar__link-control--home")
const control__notify=$(".narbar__link-control-notify")
const control__message=$(".narbar__link-control-mess")
const control__close_message=$(".message__header-close")
const control__starts=$(".homepage")
//dieu huong trang ca nhan
const breadcrumb=$(".breadcrum")
const breadcrumsItems=$$(".breadcrum__item")
const breadcrumHome= $(".breadcrum__item--Home");
const breadcrumInfo= $(".breadcrum__item--Info");
const breadcrumChangeInfo= $(".breadcrum__item--ChangeInfo");
const breadcrumCloses=$(".icon--closer")
//content dieu huong
const inforItems=$$(".info-item")
const infor=$(".info")
const changeInfor=$(".change-info")
const point=$(".point")
const inforBtn=$(".info__btn")
const changInforBtn=$(".change-info__btn")

//dang nhap
const login=$(".login")

// login.addEventListener("submit",(e)=>{
//     e.preventDefault()
//     console.log("submit")
//     $(".modul").classList.add("display__none")
//     narbar.classList.remove("display__none") 
//     control__starts.classList.remove("display__none")
//     control__home.parentElement.classList.add("active")
//     control__home.style.cursor="default";
// })
window.onload = function() {
    // $(".modul").classList.add("display__none")
    narbar.classList.remove("display__none") 
    control__starts.classList.remove("display__none")
    control__home.parentElement.classList.add("active")
    control__home.style.cursor="default";
}

/// control web
control__home.addEventListener("click",()=>{
    control__home.classList.remove("display__none")
    control__home.style.cursor="default";
    control__starts.classList.remove("display__none")
    control__home.parentElement.classList.add("active")
    control__info.style.cursor="pointer";
    //active khoi dang fucus
    control__info.parentElement.classList.remove("active")

    //xoa thanh dieu huong
    Array.from(breadcrumsItems).forEach((it,index)=>
    {
        it.classList.add("display__none")
        it.classList.remove("active")
    })
    breadcrumb.classList.add("display__none")
    //xoa content info
    Array.from(inforItems).forEach((it,index)=>
    {
        it.classList.add("display__none")
    })
    
    //breadcrumInfo.classList.remove("display__none")
   
    
})
control__info.addEventListener("click",()=>{
    control__starts.classList.add("display__none")
    control__home.style.cursor="pointer";
    control__home.parentElement.classList.remove("active")
    control__info.style.cursor="default";
    //active khoi dang fucus
    control__info.parentElement.classList.add("active")

    //hien thanh dieu huong
    breadcrumb.classList.remove("display__none")
    
    breadcrumHome.classList.remove("display__none")
    breadcrumInfo.classList.remove("display__none")
    
    //breadcrumInfo.classList.remove("display__none")
    breadcrumHome.classList.add("active")
    

    point.classList.remove("display__none")
    
})
control__notify.addEventListener("click",()=>{
    $(".menu-notify").classList.toggle("show");
    $(".message").classList.remove("show");

})
control__message.addEventListener("click",(e)=>{
   
    $(".message").classList.add("show");
    $(".menu-notify").classList.remove("show");

})
control__close_message.addEventListener("click",(e)=>{
   
   
    $(".message").classList.remove("show");
    $(".menu-notify").classList.remove("show");

})
//control dieu huong
breadcrumHome.addEventListener("click",(e) => {
    e.stopPropagation();
    if(!breadcrumHome.classList.contains("active"))
    {
        Array.from(breadcrumsItems).forEach((it,index)=>
        {
            it.classList.remove("active")
        })
        Array.from(inforItems).forEach((it,index)=>
        {
            it.classList.add("display__none")
        })
        breadcrumHome.classList.add("active")
        point.classList.remove("display__none")
    }
})
breadcrumInfo.addEventListener("click",(e)=>{
    e.stopPropagation();
    if(!breadcrumInfo.classList.contains("active"))
    {
        Array.from(breadcrumsItems).forEach((it,index)=>
        {
            it.classList.remove("active")
        })
        Array.from(inforItems).forEach((it,index)=>
        {
            it.classList.add("display__none")
        })
        breadcrumInfo.classList.add("active")
        infor.classList.remove("display__none")
        console.log("active")
    }
})
breadcrumChangeInfo.addEventListener("click",(e)=>{
    e.stopPropagation()
    console.log("active")

    if(!breadcrumChangeInfo.classList.contains("active"))
    {
        Array.from(breadcrumsItems).forEach((it,index)=>
        {
            it.classList.remove("active")
        })
        Array.from(inforItems).forEach((it,index)=>
        {
            it.classList.add("display__none")
        })
        breadcrumChangeInfo.classList.add("active")
        changeInfor.classList.remove("display__none")
    }
})
breadcrumCloses.addEventListener("click",(e)=>{
    e.stopPropagation()
    infor.classList.remove("display__none")
    changeInfor.classList.add("display__none")
    breadcrumInfo.classList.add("active")
    breadcrumChangeInfo.classList.add("display__none")
    breadcrumChangeInfo.classList.remove("active")
    
})
//btn info
inforBtn.addEventListener("click",()=>{
    infor.classList.add("display__none")
    changeInfor.classList.remove("display__none")
    breadcrumInfo.classList.remove("active")
    breadcrumChangeInfo.classList.remove("display__none")
    breadcrumChangeInfo.classList.add("active")
})
changInforBtn.addEventListener("click",()=>{
    infor.classList.remove("display__none")
    changeInfor.classList.add("display__none")
    breadcrumInfo.classList.add("active")
    breadcrumChangeInfo.classList.add("display__none")
    breadcrumChangeInfo.classList.remove("active")
})


let scrollAmount = 0;
const slider = document.getElementById('news-slider');
const scrollPerClick = 300; // Số pixel cần trượt với mỗi click

document.getElementById('slideLeft').addEventListener('click', () => {
  slider.scrollTo({
    top: 0,
    left: (scrollAmount -= scrollPerClick),
    behavior: 'smooth',
  });

  if(scrollAmount < 0) {
    scrollAmount = 0;
  }
});

document.getElementById('slideRight').addEventListener('click', () => {
  if(scrollAmount <= slider.scrollWidth - slider.clientWidth) {
    slider.scrollTo({
      top: 0,
      left: (scrollAmount += scrollPerClick),
      behavior: 'smooth',
    });
  }
});


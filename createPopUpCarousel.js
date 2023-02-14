let dataVisualisation;
console.log('ran')
let popup = document.getElementById('carousel-popup');

let indicators = document.getElementById('carousel-indicators');

let allItems = document.getElementById('itemHolder');



function carouselMaker(source){

Carousel(source.id)

}

let arr = []

function Carousel(foldere){
var folder = "/images/"+foldere;

$.ajax({
    url : folder,
    success: function (data) {
        $(data).find("a").attr("href", function (i, val) {
            

            if( val.match(/\.(jpe?g|png|gif)$/) ) { 
arr.push(val)
            }
        });
        console.log(arr)
         for(let items = 0; items < arr.length; items++){
                let item = document.createElement('div');
                item.classList.add('item')
                
                
                
                let img = document.createElement('img')
                img.classList.add('img-fluid');
                img.src=arr[items];
              
                if(items === 0){
              
                    item.classList.add('active');
                }
                item.append(img)
         
                allItems.append(item)
             
               
             } 
            for(let createLi = 0; createLi < arr.length; createLi++){
                
                let li = document.createElement('li');
                li.setAttribute('data-target', 'carousel-popup');
                li.setAttribute('data-slide-to', createLi);
                if(li === 0){
              
                    li.classList.add('active');
                }
         
                indicators.append(li)
                
            }

            document.getElementById('popup').style.display = "block";
    }
});
}


document.getElementById('popup').ondblclick = function(){
    arr = []
              
            while(indicators.firstChild) {
                indicators.removeChild(indicators.firstChild);
            }

        
    while(allItems.firstChild) {
        allItems.removeChild(allItems.firstChild);
    }
   

    document.getElementById('popup').style.display = "none";
}

document.getElementById('close').onclick = function(){
    arr = []
              
            while(indicators.firstChild) {
                indicators.removeChild(indicators.firstChild);
            }

        
    while(allItems.firstChild) {
        allItems.removeChild(allItems.firstChild);
    }
   

    document.getElementById('popup').style.display = "none";
}

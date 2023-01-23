    let productsContainer=document.querySelector('.products .container');
    let totalSpan=document.querySelector('.total-span');
    let countSpan=document.querySelector('span.count');
    let productsCount=[];
    let array=[];
    //show products 
    function fetchData(){
        fetch('items.json').then(
            (response)=>{
                let promise=response.json();
                return promise;
            }
        ).then(
            (data)=>{
                let organized=organizeData(data.items);
                showProducts(organized);
                let addToCartBtn=document.querySelectorAll('.image button');
                toggle(addToCartBtn);
                addToCart(addToCartBtn,organized);
                itemsCount();
            }
        )
    }
    fetchData();
    function organizeData(dataItems){
        let x=dataItems.map(item=>{
            let {id}=item.sys;
            let {title,price}=item.fields;
            let {url}=item.fields.image.fields.file;
            return {id,title,price,url};
        })
        return x;
    }
    //show products
    function showProducts(data){
        data.forEach((ele,index)=>{
            let product=document.createElement('div');
            product.classList.add('product');
            productsContainer.append(product);
            //image div
            let imageDiv=document.createElement('div');
            imageDiv.classList.add('image');
            imageDiv.innerHTML=`
            <button data-id=${index+1}>
                <i class="fas fa-shopping-cart"></i>
                Add To Bag
            </button>
            `
            //image
            let img=document.createElement('img');
            img.src=ele.url;
            imageDiv.append(img);
            product.append(imageDiv);
            //info
            let infoDiv=document.createElement('div');
            infoDiv.classList.add('info');
            product.append(infoDiv);
            //title div
            let titleDiv=document.createElement('div');
            titleDiv.classList.add('name');
            titleDiv.textContent=ele.title;
            infoDiv.append(titleDiv);
            //price div
            let priceDiv=document.createElement('div');
            priceDiv.classList.add('price');
            priceDiv.textContent=ele.price;
            infoDiv.append(priceDiv);
        })
    }
    //toggle buttons 
    let overlay=document.querySelector('.overlay');
    let yourCart=document.querySelector('.your-cart');
    let yourCartContent=document.querySelector('.your-cart .content');
    let shoppingCart=document.querySelector('.fa-cart-shopping')
    let closeCart=document.querySelector('i.fa-window-close');
    function toggle(addToCartBtn){
        function x(){
            overlay.classList.toggle('active');
            yourCart.classList.toggle('active');
        }
        addToCartBtn.forEach(btn=>{
            btn.addEventListener('click',x)
        })
        closeCart.addEventListener('click',x);
        shoppingCart.addEventListener('click',x);
    }
    //add to cart
    let titleArray=[];
    function addToCart(addToCartBtn,items){
        addToCartBtn.forEach((btn,index)=>{
            btn.addEventListener('click',()=>{
                if(checkRepeated(titleArray,items[index].title)){
                    itemsArray.push(items[index]);
                    localStorage.setItem('itemsArray',JSON.stringify(itemsArray));
                    add(items[index]);
                    calculateTotal();
                }
            })
            
        })
    }
    let itemsArray=[];
    if(localStorage.getItem('itemsArray')){
        array=JSON.parse(localStorage.getItem('pCount'));
        itemsArray=JSON.parse(localStorage.getItem('itemsArray'));
        itemsArray.forEach((item,index)=>{
            add(item);
        })
        totalSpan.innerHTML=localStorage.getItem('price');
        countSpan.innerHTML=localStorage.getItem('count');
        let pCount=document.querySelectorAll('p.count');
        for(let i=0;i<pCount.length;i++)
        pCount[i].innerHTML=array[i];
    }
    function add(item){
            let cartItem=document.createElement('div');
                yourCartContent.append(cartItem);
                cartItem.classList.add('cart-item','flex');
                cartItem.innerHTML=`
                <div class="left flex">
                <img src="${item.url}" alt="">
                <div class="info">
                <p class="title">${item.title}</p>
                <p class="price">$${item.price}</p>
                <span class="remove">Remove</span>
                </div>
                </div>
                <div class="arrows">
                <i class="fa-solid fa-chevron-up"></i>
                <p class="count">1</p>
                <i class="fa-solid fa-chevron-down"></i>
                </div>
                
            `
            titleArray.push(item.title);
            itemsCount();
    }
    function checkRepeated(array,title){
        for(let i=0;i<array.length;i++)
        if(array[i]==title)
        return false;
        return true;
    }
    
    function itemsCount(){
        let arrowsUp=yourCartContent.querySelectorAll('.fa-chevron-up');
        let arrowsDown=yourCartContent.querySelectorAll('.fa-chevron-down');
        let pCount=Array.from(document.querySelectorAll('p.count'));
        
        arrowsUp.forEach((arrow,index)=>{
        if(!arrow.onclick){
            arrow.onclick=function(){
                pCount[index].innerHTML++;
                calculateTotal();
            }
    }
    })
        arrowsDown.forEach((arrow,index)=>{
        if(!arrow.onclick){
            arrow.onclick=function(){
                if(pCount[index].innerHTML-1!=0)
                pCount[index].innerHTML--;
                else{
                    pCount[index].parentElement.parentElement.remove();
                    pCount.splice(index,1);
                    itemsArray.splice(index,1);
                    titleArray.splice(index,1);
                    localStorage.setItem('itemsArray',JSON.stringify(itemsArray));
                }
                calculateTotal();
            }
    }
    })

    }
    let clearAll=document.querySelector('.clear-all button');
    clearAll.addEventListener('click',function(){
        yourCartContent.innerHTML='';
        itemsArray=[];
        titleArray=[];
        localStorage.setItem('itemsArray',JSON.stringify(itemsArray));
        calculateTotal();
    })
    
    function calculateTotal(){
        let pCount=Array.from(document.querySelectorAll('p.count'));
        let x=0,y=0;
        array.length=pCount.length;
        for(let i=0;i<pCount.length;i++)
        {
            x+=itemsArray[i].price * +pCount[i].innerHTML;
            y+=+pCount[i].innerHTML;
            array[i]=pCount[i].innerHTML;
        }
        totalSpan.innerHTML=x.toFixed(2);
        countSpan.innerHTML=y;
        localStorage.setItem('count',y);
        localStorage.setItem('price',x.toFixed(2));
        localStorage.setItem('pCount',JSON.stringify(array));
    }
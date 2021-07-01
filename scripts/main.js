const FORM=document.querySelector(".shortener__form"),INPUT=FORM.input,INPUT_ERROR_MESSAGE=document.querySelector(".shortener__error"),SHORTENER_TABLE=document.querySelector(".shortener__table-body"),urlRegEx=/^(http[s]?:\/\/(www\.)?){1}(?!(bit.ly))([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;if(renderUrlsFromLocalStorage(),""==SHORTENER_TABLE.innerHTML){let e=defineBtnsList();copyShortenedUrl(e)}function validateInputValue(e){if(e&&e.match(urlRegEx))return!0}function showInputErrorMessage(e){e?(FORM.input.classList.add("invalid"),INPUT_ERROR_MESSAGE.classList.remove("hidden")):(FORM.input.classList.remove("invalid"),INPUT_ERROR_MESSAGE.classList.add("hidden"))}function pushShortenedUrlToLocalStorage(e){var{link:t,long_url:n}=e;if(!sessionStorage.getItem(n)&&e.long_url)return sessionStorage.setItem(n,t),n}function renderShortenedUrl(t){if(t){let e=document.createElement("tr");return e.classList.add("shortener__table-item"),e.innerHTML=`
        <td class="shortener__table-item-link-l">${t}</td>
        <td class="shortener__table-item-link-s">${sessionStorage.getItem(t)}</td>
        <td class="shortener__table-item-btn">
            <button class="table-btn btn btn--size--tiny-long btn--style--sharpened btn--theme--grass"
            type="button">Copy</button>
        </td>
        `,SHORTENER_TABLE.appendChild(e),!0}}function renderUrlsFromLocalStorage(){if(sessionStorage.length)for(let e=0;e<sessionStorage.length;e++){var t=sessionStorage.key(e);if("undefined"==t)return;renderShortenedUrl(t)}}function defineBtnsList(){return tableBtns=document.querySelectorAll(".table-btn"),tableBtns}function copyShortenedUrl(t){for(let e=0;e<t.length;e++){const n=t[e];n.addEventListener("click",e=>{resetButtonsCopiedStyle(t),navigator.clipboard.writeText(e.target.parentNode.previousElementSibling.innerText),n.innerText="Copied!",n.classList.add("copied")})}}function resetButtonsCopiedStyle(t){for(let e=0;e<t.length;e++){const n=t[e];n.innerText="Copy",n.classList.remove("copied")}}FORM.reset(),FORM.addEventListener("submit",e=>{e.preventDefault(),validateInputValue(INPUT.value)?(showInputErrorMessage(!1),getShortenUrlResponse(INPUT.value).then(e=>pushShortenedUrlToLocalStorage(e)).then(e=>renderShortenedUrl(e)).then(()=>defineBtnsList()).then(e=>copyShortenedUrl(e)).catch(e=>console.log(e)),FORM.reset()):showInputErrorMessage(!0)});
async function getShortenUrlResponse(t){const n=await fetch("https://api-ssl.bitly.com/v4/shorten",{method:"POST",headers:{Authorization:"Bearer 27bd897789f5c44f98373c08559798dd510b54c8","Content-Type":"application/json"},body:JSON.stringify({long_url:t})});return n.json()}
const FORM = document.querySelector('.shortener__form');
const INPUT = FORM.input;
const INPUT_ERROR_MESSAGE = document.querySelector('.shortener__error');
const SHORTENER_TABLE = document.querySelector('.shortener__table-body');
const urlRegEx = /^(http[s]?:\/\/(www\.)?){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
const bitLyRegEx = /bit.ly/;

// if local storage not empty, render ulrs
renderUrlsFromLocalStorage();

if (SHORTENER_TABLE.innerHTML) {
    let btnsList = defineBtnsList();
    copyShortenedUrl(btnsList);
}

FORM.reset();

FORM.addEventListener('submit', event => {
    event.preventDefault();

    //! fix validate func
    if (!INPUT.value || !validateInputValue(INPUT.value)) {
        showInputErrorMessage(true);
        return;
    };

    showInputErrorMessage(false);

    getShortenUrlResponse(INPUT.value)
        .then(responseBody => pushShortenedUrlToLocalStorage(responseBody))
        .then(longURL => renderShortenedUrl(longURL))
        .then(() => defineBtnsList())
        .then(list => copyShortenedUrl(list))
        .catch(error => console.log(error))

    FORM.reset();
});

//! fix validate func
function validateInputValue(value) {
    if (value.match(urlRegEx) && !value.match(bitLyRegEx)) return true;
    return false;
}

function showInputErrorMessage(boolean) {
    if (boolean) {
        FORM.input.classList.add('invalid');
        INPUT_ERROR_MESSAGE.classList.remove('hidden');
    } else {
        FORM.input.classList.remove('invalid');
        INPUT_ERROR_MESSAGE.classList.add('hidden');
    }
}

function pushShortenedUrlToLocalStorage(responseBody) {
    let { link, long_url } = responseBody;

    if (localStorage.getItem(long_url) ?? true) return;

    localStorage.setItem(long_url, link);
    return long_url;
}

function renderShortenedUrl(longURL) {
    if (!longURL) return;

    let tableRow = document.createElement('tr');

    tableRow.classList.add('shortener__table-item');

    tableRow.innerHTML = `
        <td class="shortener__table-item-link-l">${longURL}</td>
        <td class="shortener__table-item-link-s">${localStorage.getItem(longURL)}</td>
        <td class="shortener__table-item-btn">
            <button class="table-btn btn btn--size--tiny-long btn--style--sharpened btn--theme--grass"
            type="button">Copy</button>
        </td>
        `
    SHORTENER_TABLE.appendChild(tableRow);

    return true;
}

function renderUrlsFromLocalStorage() {
    if (localStorage.length) {
        for (let i = 0; i < localStorage.length; i++) {
            let localStorageItem = localStorage.key(i);
            renderShortenedUrl(localStorageItem);
        }
    }
}

function defineBtnsList() {
    tableBtns = document.querySelectorAll('.table-btn');
    return tableBtns;
}

function copyShortenedUrl(list) {
    for (let i = 0; i < list.length; i++) {
        const btn = list[i];

        btn.addEventListener('click', event => {
            resetButtonsCopiedStyle(list);

            // copy shortened link
            navigator.clipboard.writeText(event.target.parentNode.previousElementSibling.innerText)

            // change button style to "copied!"
            btn.innerText = 'Copied!';
            btn.classList.add('copied');
        });
    }
}

function resetButtonsCopiedStyle(buttonsList) {
    for (let i = 0; i < buttonsList.length; i++) {
        const button = buttonsList[i];
        button.innerText = 'Copy';
        button.classList.remove('copied');
    }
}

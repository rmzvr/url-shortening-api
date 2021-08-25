const FORM = document.querySelector('.shortener__form');
const INPUT = FORM.input;
const INPUT_ERROR_MESSAGE = document.querySelector('.shortener__error');
const SHORTENER_TABLE = document.querySelector('.shortener__table-body');

const urlRegEx = /^(http[s]?:\/\/(www\.)?){1}(?!(bit.ly))([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;

// if local storage not empty, render ulrs
renderUrlsFromLocalStorage();

if (SHORTENER_TABLE.innerHTML !== '') {
    setButtonsCopyFuncionality();
}

FORM.reset();

FORM.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateInputValue(INPUT.value)) {
        showInputErrorMessage(true);
        return;
    }

    showInputErrorMessage(false);

    getShortenUrlResponse(INPUT.value)
        .then(responseBody => pushShortenedUrlToLocalStorage(responseBody))
        .then(longURL => renderShortenedUrl(longURL))
        .then(() => setButtonsCopyFuncionality())
        .catch(error => console.log(error))

    FORM.reset();
});

function validateInputValue(value) {
    if (!value || !value.match(urlRegEx)) return;
    return true;
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

    if (sessionStorage.getItem(long_url) || !responseBody.long_url) return;

    sessionStorage.setItem(long_url, link);
    return long_url;
}

function renderShortenedUrl(longURL) {
    if (!longURL) return;

    let tableRow = document.createElement('tr');

    tableRow.classList.add('shortener__table-item');

    tableRow.innerHTML = `
        <td class="shortener__table-item-link-l">
          <span>${longURL}</span>
        </td>
        <td class="shortener__table-item-link-s">
          <span>${sessionStorage.getItem(longURL)}</span>
        </td>
        <td class="shortener__table-item-btn">
            <button class="table-btn btn btn--size--tiny-long btn--style--sharpened btn--theme--grass"
            type="button">Copy</button>
        </td>
        `
    SHORTENER_TABLE.appendChild(tableRow);

    return true;
}

function renderUrlsFromLocalStorage() {
    if (sessionStorage.length) {
        for (let i = 0; i < sessionStorage.length; i++) {
            let localStorageItem = sessionStorage.key(i);

            if (localStorageItem == 'undefined') return;
            renderShortenedUrl(localStorageItem);
        }
    }
}

function setButtonsCopyFuncionality() {
    let tableBtns = document.querySelectorAll('.table-btn');

    for (let i = 0; i < tableBtns.length; i++) {
        const btn = tableBtns[i];

        btn.addEventListener('click', event => {
            resetButtonsCopiedStyle(tableBtns);

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

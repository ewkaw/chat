const $authorErrorMessage = document.getElementById('author-error');
const $authorInput = document.getElementById('author');

const $messageErrorMessage = document.getElementById('message-error');
const $messageInput = document.getElementById('message');

const $messageList = document.getElementById('message-list');

const persistedMessagesString = localStorage.getItem('messages') || '[]';
const messagesArray = JSON.parse(persistedMessagesString);

const validateAuthorField = (authorValue) => {
    if (!$authorErrorMessage)  {
        alert('Cos poszlo nie tak!');
        $authorInput.classList.add('error-border');
        return false;
    }
    // Early return 
    if (!authorValue) {
        $authorErrorMessage.innerText = 'Pole wymagane!';
        $authorInput.classList.add('error-border');
        return false;
    }

    $authorInput.classList.remove('error-border');
    $authorErrorMessage.innerText = '';
    return true;
}

const validateMessageField = (messageValue) => {
    if (!messageValue) {
        document.getElementById('message-error').innerText = 'Pole wymagane!';
        document.getElementById('message').classList.add('error-border');
        return false;
    } 

    if (messageValue.length < 2) {
        document.getElementById('message-error').innerText = 'Pole musi miec min 2 znaki!';
        document.getElementById('message').classList.add('error-border');
        return false;
    }

    $messageInput.classList.remove('error-border');
    $messageErrorMessage.innerText = '';

    return true;
}

const saveData = () => {
    localStorage.setItem('messages', JSON.stringify(messagesArray));
}

class Message {
    constructor(author, body, liked, disliked){
        this.author = author;
        this.body = body;
        this.liked = liked;
        this.disliked = disliked;
    }
}

const renderMessages = (messagesArray) => {
    $messageList.innerHTML = '';

    for(const message of messagesArray){
        $messageList.innerHTML += `
            <li class="list-group-item">
                <div class="fw-bold">${message.author}</div>
                <span>${message.body}</span>
                <button class="like-btn btn btn-info" ${message.liked && 'disabled'}>:)</button>
                <button class="dislike-btn btn btn-warning" ${message.disliked && 'disabled'}>:(</button>
            </li>
        `;
    }
    const likesBtn = Array.from(document.getElementsByClassName('like-btn'));
    for (const likeBtn of likesBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.target.setAttribute('disabled', true);

            const $parentLi = e.target.parentElement;

            const messageToLike = messagesArray.find(msg => {
                return msg.body ===  $parentLi.querySelector('span').innterText;
            });
            console.log(messageToLike);
            messageToLike.liked = true;
            saveData();

        });
    }

    const dislikesBtn = Array.from(document.getElementsByClassName('dislike-btn'));
    for (const dislikeBtn of dislikesBtn) {
        dislikeBtn.addEventListener('click', (e) => {
            e.target.setAttribute('disabled', true);
        });
    }
};

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const author = formData.get('author');
    const message = formData.get('message');

    const isAuthorValid = validateAuthorField(author);
    const isMessageValid =  validateMessageField(message);
    
    if(!isMessageValid){
        $messageInput.focus();
    }
    if(!isAuthorValid){
        $authorInput.focus();
    }

    if(!isAuthorValid || !isMessageValid) return;
    
    messagesArray.push(new Message(author, message, false, false));

    saveData();
    // localStorage.setItem('messages', JSON.stringify(messagesArray));
    renderMessages(messagesArray);
});

$authorInput.addEventListener('input', (e) => {
    validateAuthorField(e.target.value);
});

$messageInput.addEventListener('input', (e) => {
    validateMessageField(e.target.value);
});

renderMessages(messagesArray);


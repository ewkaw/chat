const $authorErrorMessage = document.getElementById('author-error');
const $authorInput = document.getElementById('author');

const $messageErrorMessage = document.getElementById('message-error');
const $messageInput = document.getElementById('message');

const $resetButton = document.getElementById('reset-btn');
const $messageList = document.getElementById('message-list');

const persistedMessagesString = localStorage.getItem('messages') || '[]';
const messagesArray = JSON.parse(persistedMessagesString);

const validateAuthorField = (authorValue) => {
    if (!$authorErrorMessage)  {
        alert('Cos poszlo nie tak!');
        $authorInput.classList.add('error-border');
        return false;
    } 
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
    localStorage.setItem('messages', JSON.stringify(messagesArray))
}

class Message {
    constructor(author, body, liked, disliked, reply) {
        this.author = author;
        this.body = body;
        this.liked = liked;
        this.disliked = disliked;
        this.reply = reply;

    };
}
const renderReplyForm = (list) => {
    //TODO add cancel reply button, after click delete this form
    const $parentLi = list;
    $parentLi.innerHTML += `<form id="reply-form" action="" >
        <label for="reply-author" class="form-label">Autor</label>
        <input type="text" name="reply-author" id="reply-author" class="form-control">
        <div id="reply-author-error" class="error-text"></div>

        <label for="reply-message" class="form-label mt-3">Wiadomosc</label>
        <textarea name="reply-message" id="reply-message" class="form-control"></textarea>
        <div id="reply-message-error" class="error-text"></div>

        <div class="d-grid gap-2 mt-3">
            <button class="btn btn-success">Odpowiedź</button>
        </div>
    </form>`;
   
    document.getElementById('reply-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const replyForm = new FormData(e.target);

        const author = replyForm.get('reply-author');
        const message = replyForm.get('reply-message');
        console.log(author);
        console.log(message);
        const $parentLi = e.target.parentElement;
        const indexOfMessageToAddReply = messagesArray.findIndex(msg => {
            return msg.body === $parentLi.querySelector('span').innerText;
        });
        messagesArray.splice(indexOfMessageToAddReply + 1, 0, new Message(author, message, false, false, true));
        saveData();
        renderMesssages(messagesArray);

    });
}

const renderMesssages = (messagesArray) => {
    $messageList.innerHTML = '';

    for (const message of messagesArray) {
        let liElement = `<li class="list-group-item ${message.reply && 'ps-5 list-group-item-dark'}">
                <div class="fw-bold">${message.author}</div>
                <span>${message.body}</span>

                <button class="like-btn btn btn-info" ${message.liked && 'disabled'}>:)</button>
                <button class="dislike-btn btn btn-warning"  ${message.disliked && 'disabled'}>:(</button>
                <button class="delete-btn btn btn-danger">Usun</button>
            `;
        if(!message.reply){
            liElement += `<button class="reply-btn btn">Odpowiedź</button>`;
        }
        $messageList.innerHTML += liElement + `</li>`;

    }

    const likesBtn = Array.from(document.getElementsByClassName('like-btn'));

    for (const likeBtn of likesBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.target.setAttribute('disabled', true);

            const $parentLi = e.target.parentElement;

            const messageToLike = messagesArray.find(msg => {
                return msg.body === $parentLi.querySelector('span').innerText;
            });

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

    const deleteBtns = Array.from(document.getElementsByClassName('delete-btn'));

    for (const deleteBtn of deleteBtns) {
        deleteBtn.addEventListener('click', (e) => {
            console.log('USUN')
            const $parentLi = e.target.parentElement;

            const indexOfMessageToDelete = messagesArray.findIndex(msg => {
                return msg.body === $parentLi.querySelector('span').innerText;
            });
            // TODO also delete replies for the message 
            messagesArray.splice(indexOfMessageToDelete, 1);
            saveData();
        
            renderMesssages(messagesArray);
        });
    }

    const repliesBtn = Array.from(document.getElementsByClassName('reply-btn'));
    for (const replyBtn of repliesBtn){
        replyBtn.addEventListener('click', (e) => {
            renderReplyForm(e.target.parentElement);
        });
    }
}

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const author = formData.get('author');
    const message = formData.get('message');

    const isAuthorValid = validateAuthorField(author);
    const isMessageValid = validateMessageField(message);

    if (!isMessageValid) {
        $messageInput.focus();
    }
    if (!isAuthorValid) {
        $authorInput.focus();
    }

    if (!isAuthorValid || !isMessageValid) return;
    
    messagesArray.push(new Message(author, message, false, false, false));
    
    saveData();
    renderMesssages(messagesArray);
});

$authorInput.addEventListener('input', (e) => {
    validateAuthorField(e.target.value);
});

$messageInput.addEventListener('input', (e) => {
    validateMessageField(e.target.value);
});


$resetButton.addEventListener('click', () => {
    $authorInput.value = null;
    $messageInput.value = null;
});

renderMesssages(messagesArray);
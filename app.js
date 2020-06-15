//Book Class: Represents a Book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach( (book) => UI.addBookToList(book));  
    }

    static addBookToList(book){
        const list = document.querySelector('.table');
        const row = document.createElement('tr');

        row.className = 'th';
        row.innerHTML = `
            <td >${book.title}</td>
            <td >${book.author}</td>
            <td >${book.isbn}</td>
            <td ><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static clearFields(){
        
        const title = document.querySelector('#name').value = '';
        const author = document.querySelector('#author').value = '';
        const isbn = document.querySelector('#isbn').value = '';
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const el = document.querySelector('p');
        el.className = `${className}`;
        el.innerHTML = message;

        //vanish in 3 seconds
        setTimeout(() => {
            el.className = '';
            el.innerHTML = '';
        }, 3000);
    }
}

//Store Class: Handles Storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(bookIsbn){
        let books = Store.getBooks();
        books = books.filter( book =>{
            return book.isbn !== bookIsbn;
        });
        localStorage.setItem('books', JSON.stringify(books));
    }   
}
//Events: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Events: Add a book
document.querySelector('#submit').addEventListener('click', (e) => {
    //Get form values
    e.preventDefault();
    const title = document.querySelector('#name').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
    if(title === '' || author === '' || isbn === ''){
        // alert('Please fill all fields');
        UI.showAlert('Please fill in all field', 'red');
    }
    else{
        //instantiate book
        const book = new Book(title, author, isbn);

        //Add Book to UI
        UI.addBookToList(book);

        //Add Book to Local Storage
        Store.addBook(book);

        //Show Success Message
        UI.showAlert('Book Added', 'green');

        UI.clearFields();
    }


});

//Events: Remove a book
document.querySelector('.table').addEventListener('click', (e) =>{
    //Remove Book from UI
    UI.deleteBook(e.target);

    //Remove Book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
    //Show Success Message
    if(e.target.classList.contains('delete')){
        UI.showAlert('Book Removed', 'green');
    }
});
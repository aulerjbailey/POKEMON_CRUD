// General variables
var persons = [];
var listPokemon = [];

var btnRegister = $("#register");
var btnUpdate = $("#update");

// Hides update button
btnUpdate.hide();

// Get all pokémon of service
const getPokemon = () => {
    $.ajax({
        type: 'GET',
        url: 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=100'
    }).done(function(res){
        listPokemon = res.results;
        let selectPokemon = $("#selectPokemon");

        selectPokemon.append('<option>Selecciona un Pokemon...</option>');
        for(let i = 0; i < listPokemon.length; i++){
            selectPokemon.append(`<option value="${ i + 1 }">${ listPokemon[i].name }</option>`);
        }
    });
};

// Fill users table with local storage list
const fill = () => {
    let content = "";

    if(persons.length > 0){
        for(let i = 0; i < persons.length; i++){
            content += `
                <tr>
                    <td>${ i + 1 }</td>
                    <td>${ persons[i].name } ${ persons[i].lastname } ${ persons[i].surname }</td>
                    <td>${ persons[i].favorite }</td>
                    <td>
                        <button onclick="getUserByIndex(${ i })" class="btn btn-primary"><i class="fas fa-edit"></i> Modificar</button>
                        <button onclick="remove(${ i })" class="btn btn-danger"><i class="fas fa-trash"></i> Eliminar</button>
                    </td>
                </tr>
            `;
        }
    } else {
        content = `
            <tr>
                <td>No hay personas registradas.</td>
            </tr>
        `;
    }

    $("#tablePokemon > tbody").html(content);
};

// Find list in local storage
const findAll = () => {
    if(typeof(Storage) !== "undefined"){
        if(!localStorage.listPersons){
            localStorage.listPersons = JSON.stringify([]);
        }

        persons = JSON.parse(localStorage.listPersons);
        fill();
    } else {
        alert("El Navegador no soporta almacenamiento WEB.");
    }
};

// Create new user
const create = () => {
    let person = new Object();

    let name = $("#name").val();
    let lastname = $("#lastname").val();
    let surname = $("#surname").val();
    let selectPokemon = $("#selectPokemon option:selected").text();

    person.name = name;
    person.lastname = lastname;
    person.surname = surname;
    person.favorite = selectPokemon;

    persons.push(person);
    localStorage.listPersons = JSON.stringify(persons);
    findAll();
};

// Set inputs with data of user by index
const getUserByIndex = (index) => {
    btnRegister.hide();
    btnUpdate.show();
    for(let i = 0; i < persons.length; i++){
        if(i === index){
            document.getElementById("name").value = persons[i].name;
            document.getElementById("lastname").value = persons[i].lastname;
            document.getElementById("surname").value = persons[i].surname;
            document.getElementById("index").value = index;

            let selectPokemon = $("#selectPokemon");
            for(let j = 0; j < listPokemon.length; j++){
                if(listPokemon[j].name === persons[i].favorite){
                    selectPokemon.append('<option selected value="'+ (i + 1) +'">'+ listPokemon[j].name +'</option>');
                } else {
                    selectPokemon.append('<option value="'+ (i + 1) +'">'+ listPokemon[j].name +'</option>');
                }
            }
        }
    }
};

// Update user
const update = () => {
    btnRegister.show();
    btnUpdate.hide();
    let index = document.getElementById("index").value;

    for(let i = 0; i < persons.length; i++){
        if(i == index){
            persons[i].name = $("#name").val();
            persons[i].lastname = $("#lastname").val();
            persons[i].surname = $("#surname").val();
            persons[i].favorite = $("#selectPokemon option:selected").text();
        }
    }

    localStorage.listPersons = JSON.stringify(persons);
    findAll();
};

// Delete user
const remove = (index) => {

    for(let i = 0; i < persons.length; i++){
        if(i === index){
            persons.splice(i, 1);
            break;
        }
    }

    localStorage.listPersons = JSON.stringify(persons);
    findAll();
};

getPokemon();
findAll();